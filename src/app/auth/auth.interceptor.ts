import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { CtpApiService } from '../data/services/ctp-api.service';
import { AuthService } from './auth.service';

let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const ctpApiService = inject(CtpApiService);

  const url = new URL(request.url);

  if (url.pathname.includes('/oauth/') || url.pathname.endsWith('/oauth/token')) {
    return next(request);
  }

  let token$: Observable<string | null>;

  if (url.pathname.includes('/me/')) {
    token$ = of(authService.getCustomerToken());
  } else {
    token$ = ctpApiService.getAccessToken();
  }

  if (isRefreshing) {
    return refreshToken(authService, request, next);
  }

  return token$.pipe(
    switchMap(token => {
      if (!token) return next(request);
      return next(addToken(request, token)).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 403) {
            return refreshToken(authService, request, next);
          }
          return throwError(() => error);
        }),
      );
    }),
  );
};

const refreshToken = (
  authService: AuthService,
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  if (!isRefreshing) {
    isRefreshing = true;
    return authService.refreshAuthToken().pipe(
      switchMap(response => {
        isRefreshing = false;
        return next(addToken(request, response.access_token));
      }),
    );
  }
  const fallbackToken = authService.getCustomerToken();
  if (!fallbackToken) return next(request);

  return next(addToken(request, fallbackToken));
};

const addToken = (request: HttpRequest<unknown>, token: string): HttpRequest<unknown> => {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
};
