import { inject, Injectable, signal } from '@angular/core';
import { CustomerDraft } from './registration.interfaces';
import { environment } from '../../environments/environment';
import { CtpApiService } from '../data/services/ctp-api.service';
import { catchError, Observable, switchMap, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from './registration.interfaces';
import { ToastService } from '../helpers/toast.service';
import { AuthService } from '../auth/auth.service';
import { CustomerSignInResult } from '../data/interfaces/user-data.interfaces';
import { CartActionsService } from '../cart/cart-actions.service';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  public static emailExist = signal(false);
  private http = inject(HttpClient);
  private ctpApiService = inject(CtpApiService);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);
  private cartService = inject(CartActionsService);

  public signUp(customerDraft: CustomerDraft): Observable<CustomerSignInResult> {
    return this.ctpApiService.getAccessToken().pipe(
      switchMap((token: string | null) => {
        if (!token) {
          throw new Error('No access token available');
        }

        return this.http.post<CustomerDraft>(
          `${environment.ctp_api_url}/${environment.ctp_project_key}/customers`,
          customerDraft,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
      }),
      tap(() => {
        this.toastService.success('Successful registration');
      }),
      switchMap(() => {
        return this.authService.login({
          email: customerDraft.email,
          password: customerDraft.password,
        });
      }),
      tap(() => {
        this.cartService.createCart(
          { currency: 'USD' },
          customerDraft.email,
          customerDraft.password,
        );
      }),
      catchError((error: HttpErrorResponse) => {
        const emailInput = document.getElementById('emailReg');
        RegistrationService.emailExist.set(true);
        const event = new Event('input');
        emailInput?.dispatchEvent(event);
        RegistrationService.emailExist.set(false);
        return throwError(() => error);
      }),
    );
  }
}
