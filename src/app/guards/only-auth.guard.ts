import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { inject } from '@angular/core';

export const authOnlyGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isAuth = authService.isAuth;

  if (isAuth) {
    return true;
  }
  return router.parseUrl(router.url);
};
