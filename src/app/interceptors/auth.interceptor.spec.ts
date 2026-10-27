import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse, provideHttpClient, withInterceptors, withXhr } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { authInterceptor } from './auth.interceptor';
import { SsoService } from '../services/sso/sso.service';
import { environment } from '../../environments/environment';
import { ObservedValueOf, of, Subject } from 'rxjs';

type TokenResponse = ObservedValueOf<ReturnType<SsoService['refreshAccessToken']>>;

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let sso: SsoService;

  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withXhr(), withInterceptors([authInterceptor])),
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

  it('should fail pending requests when the refresh fails', () => {
    const refresh$ = new Subject<TokenResponse | null>();
    spyOn(sso, 'getAccessToken').and.returnValue('old-token');
    spyOn(sso, 'refreshAccessToken').and.returnValue(refresh$);
    spyOn(sso, 'logout').and.resolveTo();

    let leaderError: unknown;
    let pendingError: unknown;
    http.get(`${environment.apiBaseUrl}/proxies`).subscribe({ error: err => (leaderError = err) });
    http.get(`${environment.apiBaseUrl}/whitelist`).subscribe({ error: err => (pendingError = err) });

    httpMock.expectOne(`${environment.apiBaseUrl}/proxies`)
      .flush(null, { status: 401, statusText: 'Unauthorized' });
    httpMock.expectOne(`${environment.apiBaseUrl}/whitelist`)
      .flush(null, { status: 401, statusText: 'Unauthorized' });

    refresh$.error(new Error('refresh rejected'));

    // La requête qui a lancé le refresh reçoit son erreur ; celle en attente, son 401 d'origine.
    expect((leaderError as Error).message).toBe('refresh rejected');
    expect((pendingError as HttpErrorResponse).status).toBe(401);
    expect(sso.refreshAccessToken).toHaveBeenCalledTimes(1);
  });

  it('should retry pending requests once the refresh succeeds', () => {
    const refresh$ = new Subject<TokenResponse | null>();
    spyOn(sso, 'getAccessToken').and.returnValues('old-token', 'old-token', 'new-token');
    spyOn(sso, 'refreshAccessToken').and.returnValue(refresh$);

    http.get(`${environment.apiBaseUrl}/proxies`).subscribe();
    http.get(`${environment.apiBaseUrl}/whitelist`).subscribe();

    httpMock.expectOne(`${environment.apiBaseUrl}/proxies`)
      .flush(null, { status: 401, statusText: 'Unauthorized' });
    httpMock.expectOne(`${environment.apiBaseUrl}/whitelist`)
      .flush(null, { status: 401, statusText: 'Unauthorized' });

    refresh$.next({
      access_token: 'new-token',
      token_type: 'Bearer',
      expires_in: 3600,
      refresh_token: 'refresh',
      scope: 'openid',
    });

    for (const path of ['proxies', 'whitelist']) {
      const retry = httpMock.expectOne(`${environment.apiBaseUrl}/${path}`);
      expect(retry.request.headers.get('Authorization')).toBe('Bearer new-token');
      retry.flush([]);
    }
  });
});
