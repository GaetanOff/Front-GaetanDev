import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { authInterceptor } from './auth.interceptor';
import { SsoService } from '../services/sso/sso.service';
import { environment } from '../../environments/environment';
import { of } from 'rxjs';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let sso: SsoService;

  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    sso = TestBed.inject(SsoService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should attach bearer token to API requests', () => {
    spyOn(sso, 'getAccessToken').and.returnValue('token-abc');

    http.get(`${environment.apiBaseUrl}/proxies`).subscribe();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/proxies`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer token-abc');
    req.flush([]);
  });

  it('should refresh and retry on 401', () => {
    spyOn(sso, 'getAccessToken').and.returnValues('old-token', 'new-token');
    spyOn(sso, 'refreshAccessToken').and.returnValue(of({
      access_token: 'new-token',
      token_type: 'Bearer',
      expires_in: 3600,
      refresh_token: 'refresh',
      scope: 'openid',
    }));

    http.get(`${environment.apiBaseUrl}/proxies`).subscribe();

    const first = httpMock.expectOne(`${environment.apiBaseUrl}/proxies`);
    first.flush({ message: 'unauthorized' }, { status: 401, statusText: 'Unauthorized' });

    const retry = httpMock.expectOne(`${environment.apiBaseUrl}/proxies`);
    expect(retry.request.headers.get('Authorization')).toBe('Bearer new-token');
    retry.flush([]);
  });
});
