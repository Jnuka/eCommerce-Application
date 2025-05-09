import { inject, Injectable } from '@angular/core';
import { CustomerTokenResponse } from './auth.interfaces';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { CtpApiService } from '../data/services/ctp-api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public http = inject(HttpClient);
  public ctpApiService = inject(CtpApiService);

  private customerToken$ = new BehaviorSubject<string | null>(null);
  private refreshToken$ = new BehaviorSubject<string | null>(null);

  public login(payload: { email: string; password: string }): Observable<CustomerTokenResponse> {
    return this.ctpApiService.getAccessToken().pipe(
      switchMap((token: string | null) => {
        if (!token) {
          throw new Error('No access token available');
        }
        const authHeader = btoa(`${environment.ctp_client_id}:${environment.ctp_client_secret}`);
        const headers = new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${authHeader}`,
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
        this.customerToken$.next(response.access_token || null);
        this.refreshToken$.next(response.refresh_token || null);
      }),
    );
  }

  public getCustomerToken(): Observable<string | null> {
    return this.customerToken$.asObservable();
  }

  public getRefreshToken(): Observable<string | null> {
    return this.refreshToken$.asObservable();
  }
}
