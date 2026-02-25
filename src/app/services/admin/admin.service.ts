import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SsoService } from '../sso/sso.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly API_BASE = environment.apiBaseUrl;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private ssoService: SsoService,
  ) {}

  get isLogged(): boolean {
    return this.ssoService.isAuthenticated;
  }

  async logout(): Promise<void> {
    await this.ssoService.logout();
  }

  getProxies(): Observable<any> {
    return this.httpClient.get(`${this.API_BASE}/proxies`, { responseType: 'json' }).pipe(
      catchError(() => of(null))
    );
  }

  getScanningProxyServers(): Observable<any> {
    return this.httpClient.get(`${this.API_BASE}/proxies/servers`, { responseType: 'json' }).pipe(
      catchError(() => of(null))
    );
  }

  getScanningProxyServersDetails(id: number): Observable<any> {
    return this.httpClient.get(`${this.API_BASE}/proxies/servers/details?id=${id}`, { responseType: 'json' }).pipe(
      catchError(() => of(null))
    );
  }

  checkProxy(protocol: string, host: string, port: number, serverToCheck: string): Observable<any> {
    return this.httpClient.post(`${this.API_BASE}/proxies/check`, {
      protocol, host, port: port.toString(), server: serverToCheck,
    }, { responseType: 'json' }).pipe(
      catchError(() => of(null))
    );
  }

  getWhitelistedIPs(): Observable<any> {
    return this.httpClient.get(`${this.API_BASE}/whitelisted`, { responseType: 'json' }).pipe(
      catchError(() => of(null))
    );
  }

  addWhitelistedIP(ip: string): Observable<string> {
    return this.httpClient.post(`${this.API_BASE}/whitelisted/add`, { address: ip }, { responseType: 'text' }).pipe(
      catchError(() => of('false'))
    );
  }

  removeWhitelistedIP(ip: string): Observable<string> {
    return this.httpClient.post(`${this.API_BASE}/whitelisted/delete`, { address: ip }, { responseType: 'text' }).pipe(
      catchError(() => of('false'))
    );
  }

  getEmails(): Observable<any> {
    return this.httpClient.get(`${this.API_BASE}/mail/getEmails`, { responseType: 'json' }).pipe(
      catchError(() => of([]))
    );
  }

  addEmail(nom: string, description: string): Observable<any> {
    return this.httpClient.post(`${this.API_BASE}/mail`, { nom, description }, { responseType: 'json' }).pipe(
      catchError(() => of({ success: false }))
    );
  }

  removeEmail(nom: string): Observable<any> {
    return this.httpClient.request('delete', `${this.API_BASE}/mail`, {
      body: { nom }, responseType: 'json'
    }).pipe(
      catchError(() => of({ success: false }))
    );
  }

  getEmailsWords(): Observable<any> {
    return this.httpClient.get(`${this.API_BASE}/mail/getWords`, { responseType: 'json' }).pipe(
      catchError(() => of(null))
    );
  }
}
