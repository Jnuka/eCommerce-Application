import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { MyCartDraft, CartResponse } from './create-cart.interfaces';
import { AuthService } from '../auth/auth.service';
import { UserDataService } from '../data/services/user-data.service';

@Injectable({
  providedIn: 'root',
})
export class CreateCartService {
  private http = inject(HttpClient);
  private cartId$ = new BehaviorSubject<string | null>(null);
  private authService = inject(AuthService);
  private userDataService = inject(UserDataService);

  public getCartIdn(): Observable<string | null> {
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
        tap(response => {
          this.cartId$.next(response.id);
        }),
        switchMap(() => this.userDataService.loginCustomer(email, password)),
      )
      .subscribe({
        next: () => {
          console.log('Cart created and user data refreshed'); // eslint-disable-line no-console
        },
        error: error => {
          console.error('Create cart or loginCustomer error', error); // eslint-disable-line no-console
        },
      });
  }
}
