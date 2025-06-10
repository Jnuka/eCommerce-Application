import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, tap, throwError, catchError } from 'rxjs';
import { environment } from '../../environments/environment';
import { MyCartDraft, CartResponse } from './cart-actions.interfaces';
import { AuthService } from '../auth/auth.service';
import { UserDataService } from '../data/services/user-data.service';
import { CtpApiService } from '../data/services/ctp-api.service';
import { UpdateCart, UpdateCartResponse } from './cart-actions.interfaces';
import { HttpErrorResponse } from '../auth/auth.interfaces';

@Injectable({
  providedIn: 'root',
})
export class CartActionsService {
  private http = inject(HttpClient);
  private cartId$ = new BehaviorSubject<string | null>(null);
  private authService = inject(AuthService);
  private userDataService = inject(UserDataService);
  private ctpApiService = inject(CtpApiService);

  public getCartId(): Observable<string | null> {
    return this.cartId$.asObservable();
  }

  public createCart(cartDraft: MyCartDraft, email: string, password: string): void {
    const token = this.authService.getCustomerToken();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    });

    this.http
      .post<CartResponse>(
        `${environment.ctp_api_url}/${environment.ctp_project_key}/me/carts`,
        cartDraft,
        { headers },
      )
      .pipe(
        tap(response => this.cartId$.next(response.id)),
        switchMap(() => this.userDataService.loginCustomer(email, password)),
      )
      .subscribe({
        next: () => console.log('Cart created and user refreshed'), // eslint-disable-line
        error: err => console.error('Cart creation error:', err), // eslint-disable-line
      });
  }

  public addToCart(
    cartId: string,
    version: number,
    productId: string,
    variantId: string,
    quantity = 1,
  ): Observable<UpdateCartResponse> {
    return this.ctpApiService.getAccessToken().pipe(
      switchMap((token: string | null) => {
        if (!token) throw new Error('No access token available');

        const body: UpdateCart = {
          version,
          actions: [
            {
              action: 'addLineItem',
              productId,
              variantId,
              quantity,
            },
          ],
        };

        const url = `${environment.ctp_api_url}/${environment.ctp_project_key}/carts/${cartId}`;

        return this.http.post<UpdateCartResponse>(url, body, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }),
      tap(() => {
        this.userDataService.refreshCustomerData();
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      }),
    );
  }

  public getCart(): Observable<CartResponse> {
    const token = this.authService.getCustomerToken();
    const userID = this.userDataService._customerData()?.customer.id;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
    return this.http.get<CartResponse>(
      `${environment.ctp_api_url}/${environment.ctp_project_key}/carts/customer-id=${userID}`,
      { headers },
    );
  }
}
