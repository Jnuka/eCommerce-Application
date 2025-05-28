import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CustomCustomerAddress,
  Customer,
  CustomerSignInResult,
} from '../interfaces/user-data.interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  public readonly _customerData = signal<CustomerSignInResult | null>(null);
  public readonly customerData = this._customerData;

  private http = inject(HttpClient);
  private cookieService = inject(CookieService);

  public static mapCustomAddresses(customer: Customer): CustomCustomerAddress[] {
    return customer.addresses.map(
      (address): CustomCustomerAddress => ({
        ...address,
        isShipping: customer.shippingAddressIds.includes(address.id),
        isBilling: customer.billingAddressIds.includes(address.id),
        isDefaultShipping: customer.defaultShippingAddressId === address.id,
        isDefaultBilling: customer.defaultBillingAddressId === address.id,
      }),
    );
  }

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
          const customAddresses = UserDataService.mapCustomAddresses(customerResponse.customer);
          const fullCustomer = {
            ...customerResponse,
            customAddresses,
          };
          console.log('[LOGIN] Final _customerData:', fullCustomer); // eslint-disable-line no-console
          this._customerData.set(fullCustomer);
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
            const customAddresses = UserDataService.mapCustomAddresses(customerResponse.customer);
            const fullCustomer = {
              ...customerResponse,
              customAddresses,
            };
            console.log('[AUTO LOGIN] Final _customerData:', fullCustomer); // eslint-disable-line no-console
            this._customerData.set(fullCustomer);
          }),
        );
    }
    return null;
  }

  public refreshCustomerData(): void {
    const token = this.cookieService.get('token');
    const email = this.cookieService.get('user_email');
    const password = this.cookieService.get('user_password');

    if (token && email && password) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      });

      const body = { email, password };

      this.http
        .post<CustomerSignInResult>(
          `${environment.ctp_api_url}/${environment.ctp_project_key}/login`,
          body,
          { headers },
        )
        .pipe(
          tap((customerResponse: CustomerSignInResult) => {
            const customAddresses = UserDataService.mapCustomAddresses(customerResponse.customer);

            const fullCustomer: CustomerSignInResult = {
              ...customerResponse,
              customAddresses,
            };
            this._customerData.set(fullCustomer);
          }),
        )
        .subscribe({
          error: error => {
            console.error('[REFRESH ERROR]', error); // eslint-disable-line no-console
          },
        });
    }
  }
}
