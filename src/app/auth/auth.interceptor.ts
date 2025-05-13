import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { CtpApiService } from '../data/services/ctp-api.service';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const ctpApiService = inject(CtpApiService);

  const url = new URL(request.url);

  if (url.pathname.includes('/oauth/') || url.pathname.endsWith('/oauth/token')) {
    return next(request);
  }

  let modifiedRequest = request;
  let token$: Observable<string | null>;

  if (url.pathname.includes('/me/')) {
    token$ = of(authService.getCustomerToken());
  } else {
    token$ = ctpApiService.getAccessToken();
  }

  return token$.pipe(
    switchMap(token => {
      if (token) {
        modifiedRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      return next(modifiedRequest);
    }),
  );
};
