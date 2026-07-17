import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError, firstValueFrom } from 'rxjs';
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
    refreshToken: 'sso_refresh_token',
    state: 'sso_state',
    codeVerifier: 'sso_code_verifier',
  };

  /** Legacy keys previously stored in localStorage — wiped on init. */
  private readonly LEGACY_LOCAL_KEYS = [
    'sso_access_token',
    'sso_refresh_token',
    'sso_token_expires_at',
  ];

  /** Short-lived access token kept in memory only (not readable via XSS storage APIs after navigation). */
  private accessToken: string | null = null;
  private expiresAt = 0;
  private restorePromise: Promise<boolean> | null = null;

  constructor(private http: HttpClient, private router: Router) {
    this.clearLegacyLocalStorage();
  }

  get isAuthenticated(): boolean {
    return !!this.accessToken && Date.now() < this.expiresAt;
  }

  getAccessToken(): string | null {
    if (!this.accessToken || Date.now() >= this.expiresAt) {
      return null;
    }
    return this.accessToken;
  }

  /**
   * Restores an access token from the sessionStorage refresh token when needed
   * (e.g. after a full page reload).
   */
  ensureAuthenticated(): Promise<boolean> {
    if (this.isAuthenticated) {
      return Promise.resolve(true);
    }

    const refreshToken = sessionStorage.getItem(this.STORAGE_KEYS.refreshToken);
    if (!refreshToken) {
      return Promise.resolve(false);
    }

    if (!this.restorePromise) {
      this.restorePromise = firstValueFrom(this.refreshAccessToken())
        .then(tokens => !!tokens?.access_token)
        .catch(() => false)
        .finally(() => {
          this.restorePromise = null;
        });
    }

    return this.restorePromise;
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
    const refreshToken = sessionStorage.getItem(this.STORAGE_KEYS.refreshToken);
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
    const refreshToken = sessionStorage.getItem(this.STORAGE_KEYS.refreshToken);
    const accessToken = this.accessToken;

    if (refreshToken || accessToken) {
      try {
        await firstValueFrom(
          this.http.post(`${this.API_BASE}/auth/sso/logout`, {
            token: refreshToken || accessToken,
          })
        );
      } catch {
        // Best-effort revocation
      }
    }

    this.clearTokens();
    await this.router.navigate(['/admin/auth']);
  }

  private storeTokens(tokens: TokenResponse): void {
    this.accessToken = tokens.access_token;
    this.expiresAt = Date.now() + tokens.expires_in * 1000;
    sessionStorage.setItem(this.STORAGE_KEYS.refreshToken, tokens.refresh_token);
    this.clearLegacyLocalStorage();
  }

  private clearTokens(): void {
    this.accessToken = null;
    this.expiresAt = 0;
    sessionStorage.removeItem(this.STORAGE_KEYS.refreshToken);
    sessionStorage.removeItem(this.STORAGE_KEYS.state);
    sessionStorage.removeItem(this.STORAGE_KEYS.codeVerifier);
    this.clearLegacyLocalStorage();
  }

  private clearLegacyLocalStorage(): void {
    for (const key of this.LEGACY_LOCAL_KEYS) {
      localStorage.removeItem(key);
    }
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
