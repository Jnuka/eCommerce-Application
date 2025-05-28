import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, switchMap, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CtpApiService } from '../../data/services/ctp-api.service';
import { ToastService } from '../../helpers/toast.service';
import {
  CustomerChangePassword,
  HttpErrorResponse,
  UpdatePasswordResult,
} from './update-password.interfaces';

@Injectable({
  providedIn: 'root',
})
export class UpdatePasswordService {
  private http = inject(HttpClient);
  private ctpApiService = inject(CtpApiService);
  private toastService = inject(ToastService);

  public update(
    customerId: string,
    updateCustomer: CustomerChangePassword,
  ): Observable<UpdatePasswordResult> {
    return this.ctpApiService.getAccessToken().pipe(
      switchMap((token: string | null) => {
        if (!token) {
          throw new Error('No access token available');
        }

        return this.http.post<UpdatePasswordResult>(
          `${environment.ctp_api_url}/${environment.ctp_project_key}/customers/password`,
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
        const description = error?.error?.message;
        this.toastService.error(description);
        return throwError(() => error);
      }),
    );
  }
}
