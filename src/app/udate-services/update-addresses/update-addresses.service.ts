import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, switchMap, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CtpApiService } from '../../data/services/ctp-api.service';
import { ToastService } from '../../helpers/toast.service';
import { UpdateCustomerResult } from '../udate-user-info/update-user-info.interfaces';
import { UpdateAddresses, UpdateAddressesrResult } from './update-addresses.interfaces';
import { HttpErrorResponse } from '../update-password/update-password.interfaces';

@Injectable({
  providedIn: 'root',
})
export class UpdateAddressesService {
  public ctpApiService = inject(CtpApiService);
  private http = inject(HttpClient);
  private toastService = inject(ToastService);

  public update(
    customerId: string,
    updateAddresses: UpdateAddresses,
  ): Observable<UpdateCustomerResult> {
    return this.ctpApiService.getAccessToken().pipe(
      switchMap((token: string | null) => {
        if (!token) {
          throw new Error('No access token available');
        }

        return this.http.post<UpdateAddressesrResult>(
          `${environment.ctp_api_url}/${environment.ctp_project_key}/customers/${customerId}`,
          updateAddresses,
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
        const description = error?.error?.message;
        this.toastService.error(description);
        return throwError(() => error);
      }),
    );
  }
}
