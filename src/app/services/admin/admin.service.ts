import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SsoService } from '../sso/sso.service';
import { environment } from '../../../environments/environment';
import {
  AdminEmail,
  AdminMutationResponse,
  EmailWordsResponse,
  ProxiesResponse,
  ProxyCheckResponse,
  ScanningServer,
} from '../../types';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly API_BASE = environment.apiBaseUrl;

  constructor(
    private httpClient: HttpClient,
    private ssoService: SsoService,
  ) {}

  get isLogged(): boolean {
    return this.ssoService.isAuthenticated;
  }

  async logout(): Promise<void> {
    await this.ssoService.logout();
  }

  getProxies(): Observable<ProxiesResponse> {
    return this.httpClient.get<ProxiesResponse>(`${this.API_BASE}/proxies`);
  }

  getScanningProxyServers(): Observable<ScanningServer[]> {
    return this.httpClient.get<ScanningServer[]>(`${this.API_BASE}/proxies/servers`);
  }

  getScanningProxyServersDetails(id: number): Observable<ScanningServer> {
    return this.httpClient.get<ScanningServer>(`${this.API_BASE}/proxies/servers/details?id=${id}`);
  }

  checkProxy(protocol: string, host: string, port: number, serverToCheck: string): Observable<ProxyCheckResponse> {
    return this.httpClient.post<ProxyCheckResponse>(`${this.API_BASE}/proxies/check`, {
      protocol, host, port: port.toString(), server: serverToCheck,
    });
  }

  getWhitelistedIPs(): Observable<string[]> {
    return this.httpClient.get<string[]>(`${this.API_BASE}/whitelisted`);
  }

  addWhitelistedIP(ip: string): Observable<string> {
    return this.httpClient.post(`${this.API_BASE}/whitelisted/add`, { address: ip }, { responseType: 'text' });
  }

  removeWhitelistedIP(ip: string): Observable<string> {
    return this.httpClient.post(`${this.API_BASE}/whitelisted/delete`, { address: ip }, { responseType: 'text' });
  }

  getEmails(): Observable<AdminEmail[]> {
    return this.httpClient.get<AdminEmail[]>(`${this.API_BASE}/mail/getEmails`);
  }

  addEmail(nom: string, description: string): Observable<AdminMutationResponse> {
    return this.httpClient.post<AdminMutationResponse>(`${this.API_BASE}/mail`, { nom, description });
  }

  removeEmail(nom: string): Observable<AdminMutationResponse> {
    return this.httpClient.request<AdminMutationResponse>('delete', `${this.API_BASE}/mail`, {
      body: { nom },
    });
  }

  getEmailsWords(): Observable<EmailWordsResponse> {
    return this.httpClient.get<EmailWordsResponse>(`${this.API_BASE}/mail/getWords`);
  }
}
