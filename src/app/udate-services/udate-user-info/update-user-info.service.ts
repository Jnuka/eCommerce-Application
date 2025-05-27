import { inject, Injectable } from '@angular/core';
import { UpdateCustomer, UpdateCustomerResult } from './update-user-info.interfaces';
import { catchError, Observable, switchMap, tap, throwError } from 'rxjs';
import { CtpApiService } from '../../data/services/ctp-api.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ToastService } from '../../helpers/toast.service';

@Injectable({
  providedIn: 'root',
})
export class UpdateUserInfoService {
  private http = inject(HttpClient);
  private ctpApiService = inject(CtpApiService);
  private toastService = inject(ToastService);

  public update(
    customerId: string,
    updateCustomer: UpdateCustomer,
  ): Observable<UpdateCustomerResult> {
    return this.ctpApiService.getAccessToken().pipe(
      switchMap((token: string | null) => {
        if (!token) {
          throw new Error('No access token available');
        }

        return this.http.post<UpdateCustomerResult>(
          `${environment.ctp_api_url}/${environment.ctp_project_key}/customers/${customerId}`,
          updateCustomer,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
      }),
      tap(() => {
        this.toastService.success('Successful update');
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      }),
    );
  }
}
