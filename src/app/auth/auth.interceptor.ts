import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './auth.service';
import { CtpApiService } from '../data/services/ctp-api.service';
import { Observable, of, switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const ctpApiService = inject(CtpApiService);

  if (request.url.includes('/oauth/')) {
    return next(request);
  }

  const isCustomerRequest = request.headers.get('X-Use-Customer-Token') === 'true';
  let modifiedRequest = request.clone({
    headers: request.headers.delete('X-Use-Customer-Token'),
  });

  let token$: Observable<string | null>;

  if (isCustomerRequest) {
    token$ = of(authService.getCustomerToken());
  } else {
    token$ = ctpApiService.getAccessToken();
  }

  return token$.pipe(
    switchMap(token => {
      if (token) {
        modifiedRequest = modifiedRequest.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      return next(modifiedRequest);
    }),
  );
};
