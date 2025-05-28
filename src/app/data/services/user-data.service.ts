import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CustomerSignInResult } from '../interfaces/user-data.interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  public readonly _customerData = signal<CustomerSignInResult | null>(null);
  public readonly customerData = this._customerData;

  private http = inject(HttpClient);
  private cookieService = inject(CookieService);

  public loginCustomer(email: string, password: string): Observable<CustomerSignInResult> {
    const token = this.cookieService.get('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    });

    const body = {
      email,
      password,
    };

    return this.http
      .post<CustomerSignInResult>(
        `${environment.ctp_api_url}/${environment.ctp_project_key}/login`,
        body,
        { headers },
      )
      .pipe(
        tap((customerResponse: CustomerSignInResult) => {
          this._customerData.set(customerResponse);
        }),
      );
  }

  public logout(): void {
    this._customerData.set(null);
  }

  public autoLogin(): Observable<CustomerSignInResult> | null {
    const token = this.cookieService.get('token');
    const email = this.cookieService.get('user_email');
    const password = this.cookieService.get('user_password');

    if (token && email && password) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      });

      const body = { email, password };

      return this.http
        .post<CustomerSignInResult>(
          `${environment.ctp_api_url}/${environment.ctp_project_key}/login`,
          body,
          { headers },
        )
        .pipe(
          tap((customerResponse: CustomerSignInResult) => {
            this._customerData.set(customerResponse);
          }),
        );
    }
    return null;
  }
}
