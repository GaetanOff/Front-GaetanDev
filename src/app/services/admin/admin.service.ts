import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LocalstorageService} from "../localstorage/localstorage.service";
import {Router} from "@angular/router";
import {Observable, of} from 'rxjs';
import {catchError, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  isLogged = false;
  private readonly formData: FormData;

  constructor(
    private httpClient: HttpClient,
    private localStorage: LocalstorageService,
    private router: Router
  ) {
    this.formData = new FormData();
    this.checkAdminStatus(true);
  }

  login(formData: FormData): Observable<boolean> {
    return this.httpClient.post('https://api.gaetandev.fr/auth', formData, {responseType: 'text'}).pipe(
      map((response: string) => {
        if (response === 'true' || response.trim() === 'true') {
          this.localStorage.get.setItem('adminUsername', formData.get('username') as string);
          this.localStorage.get.setItem('adminPassword', formData.get('password') as string);
          this.isLogged = true;
          return true;
        }
        return false;
      }),
      catchError(() => of(false))
    );
  }

  async logout(): Promise<void> {
    this.localStorage.get.removeItem('adminUsername');
    this.localStorage.get.removeItem('adminPassword');

    this.isLogged = false;
    this.router.navigate(['/admin/auth']).then(() => console.log('Navigated to admin/auth'));
  }

  getProxies(): Observable<any> {
    this.checkAdminStatus();

    const formData = new FormData();
    formData.append('username', this.formData.get('username') as string);
    formData.append('password', this.formData.get('password') as string);

    return this.httpClient.post('https://api.gaetandev.fr/proxies', this.formData, {responseType: 'json'});
  }

  getScanningProxyServers(): Observable<any> {
    this.checkAdminStatus();

    const formData = new FormData();
    formData.append('username', this.formData.get('username') as string);
    formData.append('password', this.formData.get('password') as string);

    return this.httpClient.post('https://api.gaetandev.fr/proxies/servers', this.formData, {responseType: 'json'});
  }

  getScanningProxyServersDetails(id: number): Observable<any> {
    this.checkAdminStatus();

    const formData = new FormData();
    formData.append('username', this.formData.get('username') as string);
    formData.append('password', this.formData.get('password') as string);
    formData.append('id', id.toString());

    return this.httpClient.post('https://api.gaetandev.fr/proxies/servers/details', formData, {responseType: 'json'});
  }

  checkProxy(protocol: string, host: string, port: number, serverToCheck: string): Observable<any> {
    const formData = new FormData();
    formData.append('username', this.formData.get('username') as string);
    formData.append('password', this.formData.get('password') as string);
    formData.append('protocol', protocol);
    formData.append('host', host);
    formData.append('port', port.toString());
    formData.append('server', serverToCheck);

    return this.httpClient.post('https://api.gaetandev.fr/proxies/check', formData, {responseType: 'json'});
  }

  getWhitelistedIPs(): Observable<any> {
    this.checkAdminStatus();

    return this.httpClient.post('https://api.gaetandev.fr/whitelisted', this.formData, {responseType: 'json'});
  }

  addWhitelistedIP(ip: string): Observable<string> {
    const formData = new FormData();
    formData.append('address', ip);
    formData.append('username', this.formData.get('username') as string);
    formData.append('password', this.formData.get('password') as string);

    return this.httpClient.post('https://api.gaetandev.fr/whitelisted/add', formData, {responseType: 'text'});
  }

  removeWhitelistedIP(ip: string): Observable<string> {
    const formData = new FormData();
    formData.append('address', ip);
    formData.append('username', this.formData.get('username') as string);
    formData.append('password', this.formData.get('password') as string);

    return this.httpClient.post('https://api.gaetandev.fr/whitelisted/delete', formData, {responseType: 'text'});
  }

  private checkAdminStatus(login?: boolean) {
    const adminUsername = this.localStorage.get.getItem('adminUsername');
    const adminPassword = this.localStorage.get.getItem('adminPassword');

    if (adminUsername && adminPassword) {

      this.formData.append('username', adminUsername);
      this.formData.append('password', adminPassword);

      if (login) {
        if (this.login(this.formData)) {
          this.isLogged = true;
        } else this.logout();
      }
    }
  }

  getEmails(): Observable<any> {
    this.checkAdminStatus();
    const formData = new FormData();
    formData.append('username', this.formData.get('username') as string);
    formData.append('password', this.formData.get('password') as string);
    return this.httpClient.post('https://api.gaetandev.fr/mail/getEmails', formData, { responseType: 'json' });
  }

  addEmail(nom: string, description: string): Observable<any> {
    this.checkAdminStatus();
    const formData = new FormData();
    formData.append('username', this.formData.get('username') as string);
    formData.append('password', this.formData.get('password') as string);
    formData.append('nom', nom);
    formData.append('description', description);
    return this.httpClient.post('https://api.gaetandev.fr/mail', formData, { responseType: 'json' });
  }

  removeEmail(nom: string): Observable<any> {
    this.checkAdminStatus();
    const formData = new FormData();
    formData.append('username', this.formData.get('username') as string);
    formData.append('password', this.formData.get('password') as string);
    formData.append('nom', nom);
    return this.httpClient.request('delete', 'https://api.gaetandev.fr/mail', { body: formData, responseType: 'json' });
  }

  getEmailsWords(): Observable<any> {
    this.checkAdminStatus();
    const formData = new FormData();
    formData.append('username', this.formData.get('username') as string);
    formData.append('password', this.formData.get('password') as string);
    return this.httpClient.post('https://api.gaetandev.fr/mail/getWords', formData, { responseType: 'json' });
  }
}
