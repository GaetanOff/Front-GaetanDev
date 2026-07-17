import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { SsoService } from '../services/sso/sso.service';
import { environment } from '../../environments/environment';

let isRefreshing = false;
const refreshDone$ = new BehaviorSubject<boolean>(false);

function withBearer(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });
}

function refreshAndRetry(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  ssoService: SsoService
): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshDone$.next(false);

    return ssoService.refreshAccessToken().pipe(
      switchMap(tokens => {
        isRefreshing = false;
        if (!tokens?.access_token) {
          refreshDone$.next(false);
          ssoService.logout();
          return throwError(() => new Error('Token refresh failed'));
        }
        refreshDone$.next(true);
        return next(withBearer(req, tokens.access_token));
      }),
      catchError(err => {
        isRefreshing = false;
        refreshDone$.next(false);
        ssoService.logout();
        return throwError(() => err);
      })
    );
  }

  return refreshDone$.pipe(
    filter(done => done),
    take(1),
    switchMap(() => {
      const token = ssoService.getAccessToken();
      if (!token) {
        return throwError(() => new Error('No access token after refresh'));
      }
      return next(withBearer(req, token));
    })
  );
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const ssoService = inject(SsoService);

  const isApiRequest = req.url.startsWith(environment.apiBaseUrl);
  const isAuthEndpoint =
    req.url.includes('/auth/sso/exchange') ||
    req.url.includes('/auth/sso/refresh') ||
    req.url.includes('/auth/sso/logout');

  if (isApiRequest && !isAuthEndpoint) {
    const token = ssoService.getAccessToken();
    if (token) {
      req = withBearer(req, token);
    }
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (
        error.status === 401 &&
        isApiRequest &&
        !isAuthEndpoint
      ) {
        return refreshAndRetry(req, next, ssoService);
      }
      return throwError(() => error);
    })
  );
};
