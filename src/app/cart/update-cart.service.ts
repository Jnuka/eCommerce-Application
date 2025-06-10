import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { CtpApiService } from '../data/services/ctp-api.service';
import { UpdateCart, UpdateCartResponse } from './update-cart.interfaces';
import { ToastService } from '../helpers/toast.service';
import { HttpErrorResponse } from '../auth/auth.interfaces';

@Injectable({
  providedIn: 'root',
})
export class UpdateCartService {
  private http = inject(HttpClient);
  private ctpApiService = inject(CtpApiService);
  private toastService = inject(ToastService);

  public addToCard(
    cartId: string,
    version: number,
    productId: string,
    variantId: string,
    quantity = 1,
  ): Observable<UpdateCartResponse> {
    return this.ctpApiService.getAccessToken().pipe(
      switchMap((token: string | null) => {
        if (!token) throw new Error('No access token available');

        const updateCart: UpdateCart = {
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

        return this.http.post<UpdateCartResponse>(
          `${environment.ctp_api_url}/${environment.ctp_project_key}/carts/${cartId}`,
          updateCart,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
      }),
      tap(() => {
        this.toastService.success('Product added to cart!');
      }),
      catchError((error: HttpErrorResponse) => {
        this.toastService.error(error?.error?.message || 'Error updating cart');
        return throwError(() => error);
      }),
    );
  }
}
