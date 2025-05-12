import { inject, Injectable } from '@angular/core';
import { CustomerTokenResponse } from './auth.interfaces';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { CtpApiService } from '../data/services/ctp-api.service';
import { ToastService } from '../helpers/toast.service';
import { catchError } from 'rxjs/operators';
import { AuthErrorResponse } from './auth.interfaces';
import { HttpErrorResponse } from './auth.interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public http = inject(HttpClient);
  public ctpApiService = inject(CtpApiService);
  private toastService = inject(ToastService);

  private customerToken: string | null = null;
  private refreshToken: string | null = null;

  public get isAuth(): boolean {
    return !!this.customerToken;
  }

  public login(payload: { email: string; password: string }): Observable<CustomerTokenResponse> {
    return this.ctpApiService.getAccessToken().pipe(
      switchMap((token: string | null) => {
        if (!token) {
          this.toastService.error('No access token for login');
          throw new Error('No access token available');
        }
        const authHeader = btoa(`${environment.ctp_client_id}:${environment.ctp_client_secret}`);
        const headers = new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${authHeader}`,
          'X-Use-Customer-Token': 'true',
        });

        const body = new HttpParams()
          .set('grant_type', 'password')
          .set('username', payload.email)
          .set('password', payload.password)
          .set(
            'scope',
            ['manage_orders', 'view_published_products']
              .map(scope => `${scope}:${environment.ctp_project_key}`)
              .join(' '),
          );

        return this.http.post<CustomerTokenResponse>(
          `${environment.ctp_auth_url}/oauth/${environment.ctp_project_key}/customers/token`,
          body,
          { headers },
        );
      }),
      tap((response: CustomerTokenResponse) => {
        this.customerToken = response.access_token;
        this.refreshToken = response.refresh_token;
        this.toastService.success('Successful entry');
      }),
      catchError((error: HttpErrorResponse) => {
        const authError: AuthErrorResponse = error.error;
        const description = authError.message || 'Unknown login error';
        this.toastService.error(description);
        return throwError(() => error);
      }),
    );
  }

  public getCustomerToken(): string | null {
    return this.customerToken;
  }

  public getRefreshToken(): string | null {
    return this.refreshToken;
  }
}
