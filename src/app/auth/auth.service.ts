import { inject, Injectable } from '@angular/core';
import { CustomerSignin, CustomerTokenResponse } from './auth.interfaces';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { CtpApiService } from '../data/services/ctp-api.service';
import { ToastService } from '../helpers/toast.service';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from './auth.interfaces';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { CustomerSignInResult } from '../data/interfaces/user-data.interfaces';
import { UserDataService } from '../data/services/user-data.service';
import { ROUTES_PAGES } from '../data/enums/routers';
import { HeaderComponent } from '../common-ui/header/header.component';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public http = inject(HttpClient);
  public ctpApiService = inject(CtpApiService);
  public refreshToken: string | null = null;
  public customerToken: string | null = null;

  private toastService = inject(ToastService);
  private cookieService = inject(CookieService);
  private router = inject(Router);
  private userDataService = inject(UserDataService);

  public get isAuth(): boolean {
    if (!this.customerToken) {
      this.customerToken = this.cookieService.get('token');
      this.refreshToken = this.cookieService.get('refreshToken');
    }
    return !!this.customerToken;
  }

  public login(customerSignin: CustomerSignin): Observable<CustomerSignInResult> {
    return this.ctpApiService.getAccessToken().pipe(
      switchMap((token: string | null) => {
        if (!token) {
          throw new Error('No access token available');
        }

        this.cookieService.delete('anonymous_token');
        this.cookieService.delete('anonymous_refresh_token');

        const anonymousId = this.cookieService.get('anonymous_id');

        const authHeader = btoa(`${environment.ctp_client_id}:${environment.ctp_client_secret}`);
        const headers = new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${authHeader}`,
        });

        let body = new HttpParams()
          .set('grant_type', 'password')
          .set('username', customerSignin.email)
          .set('password', customerSignin.password)
          .set(
            'scope',
            [
              'manage_orders',
              'view_published_products',
              'view_products',
              'manage_customers',
              'view_categories',
              'manage_my_orders',
            ]
              .map(scope => `${scope}:${environment.ctp_project_key}`)
              .join(' '),
          );
        if (anonymousId) {
          body = body.set('anonymousId', anonymousId);
        }

        return this.http.post<CustomerTokenResponse>(
          `${environment.ctp_auth_url}/oauth/${environment.ctp_project_key}/customers/token`,
          body,
          { headers },
        );
      }),
      tap((response: CustomerTokenResponse) => {
        this.saveTokens(response);
        this.cookieService.set('user_email', customerSignin.email);
        this.cookieService.set('user_password', customerSignin.password);
      }),
      switchMap(() =>
        this.userDataService.loginCustomer(customerSignin.email, customerSignin.password),
      ),
      tap(() => {
        this.toastService.success('Successful entry');
        HeaderComponent.quantityIndicator = 0;
      }),
      catchError((error: HttpErrorResponse) => {
        const customError = document.querySelector('.customer-error');
        if (customError instanceof HTMLElement) {
          if (
            error.error.error_description ===
            'Customer account with the given credentials not found.'
          ) {
            customError.classList.add('show');
          }
        }
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

  public refreshAuthToken(): Observable<CustomerTokenResponse> {
    const authHeader = btoa(`${environment.ctp_client_id}:${environment.ctp_client_secret}`);
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${authHeader}`,
    });

    const body = new HttpParams()
      .set('grant_type', 'refresh_token')
      .set('refresh_token', this.refreshToken || '');

    return this.http
      .post<CustomerTokenResponse>(`${environment.ctp_auth_url}/oauth/token`, body, { headers })
      .pipe(
        tap(response => {
          this.saveTokens(response);
        }),
        catchError((error: HttpErrorResponse) => {
          this.logout();
          return throwError(() => error);
        }),
      );
  }

  public logout(): void {
    this.userDataService.logout();
    this.cookieService.deleteAll();
    this.customerToken = null;
    this.refreshToken = null;
    void this.router.navigate([ROUTES_PAGES.LOGIN]);
  }

  private saveTokens(response: CustomerTokenResponse): void {
    this.customerToken = response.access_token;
    this.refreshToken = response.refresh_token;
    this.cookieService.set('token', this.customerToken);
    this.cookieService.set('refreshToken', this.refreshToken);
  }
}
