import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { inject } from '@angular/core';

export const noAuthGuard: CanActivateFn = () => {
  const isAuth = inject(AuthService).isAuth;

  if (!isAuth) {
    return true;
  }
  return inject(Router).createUrlTree(['']);
};
