import { inject, Injectable } from '@angular/core';
import { CustomerTokenResponse } from './auth.interfaces';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { CtpApiService } from '../data/services/ctp-api.service';
import { ToastService } from '../helpers/toast.service';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from './auth.interfaces';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { CustomerSignInResult } from './auth.interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public static incorrectCredentials = false;
  public customerData: CustomerSignInResult | null = null;
  public http = inject(HttpClient);
  public ctpApiService = inject(CtpApiService);
  private toastService = inject(ToastService);
  private cookieService = inject(CookieService);
  private router = inject(Router);

  private customerToken: string | null = null;
  private refreshToken: string | null = null;

  public get isAuth(): boolean {
    if (!this.customerToken) {
      this.customerToken = this.cookieService.get('token');
      this.refreshToken = this.cookieService.get('refreshToken');
    }
    return !!this.customerToken;
  }

  public login(payload: { email: string; password: string }): Observable<CustomerSignInResult> {
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
          .set('username', payload.email)
          .set('password', payload.password)
          .set(
            'scope',
            ['manage_orders', 'view_published_products']
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
      }),
      switchMap(() => {
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.customerToken}`,
        });

        const customerBody = {
          email: payload.email,
          password: payload.password,
        };

        return this.http.post<CustomerSignInResult>(
          `${environment.ctp_api_url}/${environment.ctp_project_key}/login`,
          customerBody,
          { headers },
        );
      }),
      tap((customerResponse: CustomerSignInResult) => {
        this.toastService.success('Successful entry');
        this.customerData = customerResponse;
      }),
      catchError((error: HttpErrorResponse) => {
        const emailInput = document.getElementById('emailLog');
        const passwordInput = document.getElementById('passwordLog');
        AuthService.incorrectCredentials = true;
        const event = new Event('input');
        emailInput?.dispatchEvent(event);
        passwordInput?.dispatchEvent(event);
        AuthService.incorrectCredentials = false;
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
    this.cookieService.deleteAll();
    this.customerToken = null;
    this.refreshToken = null;
    void this.router.navigate(['login']);
  }

  private saveTokens(response: CustomerTokenResponse): void {
    this.customerToken = response.access_token;
    this.refreshToken = response.refresh_token;
    this.cookieService.set('token', this.customerToken);
    this.cookieService.set('refreshToken', this.refreshToken);
  }
}
