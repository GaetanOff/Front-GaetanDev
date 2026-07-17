import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { SsoService } from './sso.service';
import { environment } from '../../../environments/environment';

describe('SsoService', () => {
  let service: SsoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    });

    service = TestBed.inject(SsoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('should store access token in memory and refresh token in sessionStorage', () => {
    const tokens = {
      access_token: 'access-123',
      token_type: 'Bearer',
      expires_in: 3600,
      refresh_token: 'refresh-456',
      scope: 'openid',
    };

    sessionStorage.setItem('sso_refresh_token', 'old-refresh');

    let result: unknown;
    service.refreshAccessToken().subscribe(value => result = value);

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/sso/refresh`);
    req.flush(tokens);

    expect(result).toEqual(tokens);
    expect(service.getAccessToken()).toBe('access-123');
    expect(service.isAuthenticated).toBeTrue();
    expect(sessionStorage.getItem('sso_refresh_token')).toBe('refresh-456');
    expect(localStorage.getItem('sso_access_token')).toBeNull();
    expect(localStorage.getItem('sso_refresh_token')).toBeNull();
  });

  it('should wipe legacy localStorage token keys on construction', () => {
    localStorage.setItem('sso_access_token', 'legacy');
    localStorage.setItem('sso_refresh_token', 'legacy');
    localStorage.setItem('sso_token_expires_at', '1');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    });
    TestBed.inject(SsoService);

    expect(localStorage.getItem('sso_access_token')).toBeNull();
    expect(localStorage.getItem('sso_refresh_token')).toBeNull();
    expect(localStorage.getItem('sso_token_expires_at')).toBeNull();
  });
});
