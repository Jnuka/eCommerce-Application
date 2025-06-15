import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, tap, throwError, catchError, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { MyCartDraft, CartResponse, LineItem, Action } from './cart-actions.interfaces';
import { AuthService } from '../auth/auth.service';
import { UserDataService } from '../data/services/user-data.service';
import { CtpApiService } from '../data/services/ctp-api.service';
import { UpdateCart, UpdateCartResponse } from './cart-actions.interfaces';
import { HttpErrorResponse } from '../auth/auth.interfaces';
import { CookieService } from 'ngx-cookie-service';
import { HeaderComponent } from '../common-ui/header/header.component';

@Injectable({
  providedIn: 'root',
})
export class CartActionsService {
  public anonymousCart$ = new BehaviorSubject<CartResponse | null>(null);
  public readonly anonymousCart = this.anonymousCart$.asObservable();
  private http = inject(HttpClient);
  private cartId$ = new BehaviorSubject<string | null>(null);
  private authService = inject(AuthService);
  private userDataService = inject(UserDataService);
  private ctpApiService = inject(CtpApiService);
  private cookieService = inject(CookieService);

  public getCartId(): Observable<string | null> {
    return this.cartId$.asObservable();
  }

  public createCart(cartDraft: MyCartDraft, email: string, password: string): Observable<void> {
    const token = this.authService.getCustomerToken();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    });

    return this.http
      .post<CartResponse>(
        `${environment.ctp_api_url}/${environment.ctp_project_key}/me/carts`,
        cartDraft,
        { headers },
      )
      .pipe(
        tap(response => this.cartId$.next(response.id)),
        switchMap(() => this.userDataService.loginCustomer(email, password)),
        map(() => {}), // eslint-disable-line
      );
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
        
        return this.http
          .post<UpdateCartResponse>(url, body, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })
          .pipe(
            switchMap(() => this.getCartById(cartId, token)),
            tap((updatedCart: CartResponse) => {
              const isAnonymous = !updatedCart.customerId;
              if (isAnonymous) {
                this.anonymousCart$.next(updatedCart);
              } else {
                HeaderComponent.quantityIndicator = updatedCart.totalLineItemQuantity;
                this.userDataService.refreshCustomerData();
              }
            }),
          );
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      }),
    );
  }
  
  public createAnonymousCart(cartDraft: MyCartDraft): Observable<CartResponse> {
    const anonymous_token = this.cookieService.get('anonymous_token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${anonymous_token}`,
    });

    return this.http
      .post<CartResponse>(
        `${environment.ctp_api_url}/${environment.ctp_project_key}/me/carts`,
        cartDraft,
        { headers },
      )
      .pipe(
        tap(response => {
          this.cartId$.next(response.id);
          this.anonymousCart$.next(response);
        }),
        catchError((error: HttpErrorResponse) => {
          console.log('Anonymous cart creation error:', error); // eslint-disable-line
          return throwError(() => error);
        }),
      );
  }
  
  private getCartById(cartId: string, token: string): Observable<CartResponse> {
    const url = `${environment.ctp_api_url}/${environment.ctp_project_key}/carts/${cartId}`;
    return this.http.get<CartResponse>(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }
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

  public changeQuantity(
    cartId: string,
    version: number,
    lineItemId: string,
    quantity: number,
  ): Observable<CartResponse> {
    return this.ctpApiService.getAccessToken().pipe(
      switchMap((token: string | null) => {
        if (!token) throw new Error('No access token available');

        const body: UpdateCart = {
          version,
          actions: [
            {
              action: 'changeLineItemQuantity',
              lineItemId: `${lineItemId}`,
              quantity: quantity,
            },
          ],
        };

        const url = `${environment.ctp_api_url}/${environment.ctp_project_key}/carts/${cartId}`;

        return this.http.post<CartResponse>(url, body, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }),
      tap(response => {
        HeaderComponent.quantityIndicator = response.totalLineItemQuantity;
      }),
    );
  }

  public removeFromCart(
    cartId: string,
    version: number,
    lineItemId: string,
    quantity: number,
  ): Observable<CartResponse> {
    return this.ctpApiService.getAccessToken().pipe(
      switchMap((token: string | null) => {
        if (!token) throw new Error('No access token available');

        const body: UpdateCart = {
          version,
          actions: [
            {
              action: 'removeLineItem',
              lineItemId: `${lineItemId}`,
              quantity,
            },
          ],
        };

        const url = `${environment.ctp_api_url}/${environment.ctp_project_key}/carts/${cartId}`;

        return this.http.post<CartResponse>(url, body, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }),
      tap(response => {
        HeaderComponent.quantityIndicator = response.totalLineItemQuantity;
      }),
    );
  }

  public clearCart(
    cartId: string,
    version: number,
    lineItems: LineItem[],
  ): Observable<CartResponse> {
    return this.ctpApiService.getAccessToken().pipe(
      switchMap((token: string | null) => {
        if (!token) throw new Error('No access token available');

        const body: UpdateCart = {
          version,
          actions: [],
        };

        lineItems.forEach(element => {
          const item: Action = {
            action: 'removeLineItem',
            lineItemId: `${element.id}`,
            quantity: element.quantity,
          };
          body.actions.push(item);
        });

        const url = `${environment.ctp_api_url}/${environment.ctp_project_key}/carts/${cartId}`;

        return this.http.post<CartResponse>(url, body, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }),
      tap(response => {
        HeaderComponent.quantityIndicator = response.totalLineItemQuantity;
      }),
    );
  }
}
