import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

interface UserInfo {
  sub: string;
  preferred_username: string;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class SsoService {
  private readonly SSO_BASE = environment.sso.baseUrl;
  private readonly CLIENT_ID = environment.sso.clientId;
  private readonly REDIRECT_URI = environment.sso.redirectUri;
  private readonly SCOPES = environment.sso.scopes;
  private readonly API_BASE = environment.apiBaseUrl;

  private readonly STORAGE_KEYS = {
    accessToken: 'sso_access_token',
    refreshToken: 'sso_refresh_token',
    expiresAt: 'sso_token_expires_at',
    state: 'sso_state',
    codeVerifier: 'sso_code_verifier',
  };

  constructor(private http: HttpClient, private router: Router) {}

  get isAuthenticated(): boolean {
    const token = this.getAccessToken();
    const expiresAt = localStorage.getItem(this.STORAGE_KEYS.expiresAt);
    if (!token || !expiresAt) return false;
    return Date.now() < parseInt(expiresAt, 10);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.STORAGE_KEYS.accessToken);
  }

  async initiateLogin(): Promise<void> {
    const state = this.generateRandomString(32);
    const codeVerifier = this.generateRandomString(64);
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);

    sessionStorage.setItem(this.STORAGE_KEYS.state, state);
    sessionStorage.setItem(this.STORAGE_KEYS.codeVerifier, codeVerifier);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.CLIENT_ID,
      redirect_uri: this.REDIRECT_URI,
      scope: this.SCOPES,
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    window.location.href = `${this.SSO_BASE}/oauth/authorize?${params.toString()}`;
  }

  handleCallback(code: string, state: string): Observable<boolean> {
    const savedState = sessionStorage.getItem(this.STORAGE_KEYS.state);
    const codeVerifier = sessionStorage.getItem(this.STORAGE_KEYS.codeVerifier);

    sessionStorage.removeItem(this.STORAGE_KEYS.state);
    sessionStorage.removeItem(this.STORAGE_KEYS.codeVerifier);

    if (!savedState || state !== savedState) {
      return throwError(() => new Error('Invalid state parameter — possible CSRF attack'));
    }

    if (!codeVerifier) {
      return throwError(() => new Error('Missing PKCE code verifier'));
    }

    return this.http.post<TokenResponse>(`${this.API_BASE}/auth/sso/exchange`, {
      code,
      codeVerifier,
      redirectUri: this.REDIRECT_URI,
    }).pipe(
      tap(tokens => this.storeTokens(tokens)),
      map(() => true),
      catchError(err => {
        console.error('Token exchange failed:', err);
        return of(false);
      })
    );
  }

  refreshAccessToken(): Observable<TokenResponse | null> {
    const refreshToken = localStorage.getItem(this.STORAGE_KEYS.refreshToken);
    if (!refreshToken) {
      return of(null);
    }

    return this.http.post<TokenResponse>(`${this.API_BASE}/auth/sso/refresh`, {
      refreshToken,
    }).pipe(
      tap(tokens => this.storeTokens(tokens)),
      catchError(err => {
        console.error('Token refresh failed:', err);
        this.clearTokens();
        return of(null);
      })
    );
  }

  fetchUserInfo(): Observable<UserInfo> {
    return this.http.get<UserInfo>(`${this.API_BASE}/auth/sso/userinfo`);
  }

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem(this.STORAGE_KEYS.refreshToken);
    const accessToken = this.getAccessToken();

    if (refreshToken || accessToken) {
      try {
        await this.http.post(`${this.API_BASE}/auth/sso/logout`, {
          token: refreshToken || accessToken,
        }).toPromise();
      } catch {
        // Best-effort revocation
      }
    }

    this.clearTokens();
    await this.router.navigate(['/admin/auth']);
  }

  private storeTokens(tokens: TokenResponse): void {
    localStorage.setItem(this.STORAGE_KEYS.accessToken, tokens.access_token);
    localStorage.setItem(this.STORAGE_KEYS.refreshToken, tokens.refresh_token);
    const expiresAt = Date.now() + tokens.expires_in * 1000;
    localStorage.setItem(this.STORAGE_KEYS.expiresAt, expiresAt.toString());
  }

  private clearTokens(): void {
    Object.values(this.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  }

  private generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => chars[byte % chars.length]).join('');
  }

  private async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
}
