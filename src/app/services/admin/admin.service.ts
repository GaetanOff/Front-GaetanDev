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
        if (response === 'true') {
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
}
