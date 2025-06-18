import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AccessTokenResponse } from '../interfaces/ctp-api.interface';
import { ToastService } from '../../helpers/toast.service';

@Injectable({
  providedIn: 'root',
})
export class CtpApiService {
  public accessToken$ = new BehaviorSubject<string | null>(null);

  private http = inject(HttpClient);
  private toastService = inject(ToastService);

  public getAccessToken(): Observable<string | null> {
    return this.accessToken$.asObservable();
  }

  public init(): void {
    this.initAccessToken();
  }

  private initAccessToken(): void {
    const scopeString = environment.ctp_scopes.join(' ');

    const body = new HttpParams().set('grant_type', 'client_credentials').set('scope', scopeString);

    const authHeader = btoa(`${environment.ctp_client_id}:${environment.ctp_client_secret}`);
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${authHeader}`,
    });

    this.http
      .post<AccessTokenResponse>(`${environment.ctp_auth_url}/oauth/token`, body, { headers })
      .subscribe({
        next: response => {
          this.accessToken$.next(response.access_token);
        },
        error: () => {
          this.toastService.error('Error receiving access token');
        },
      });
  }
}
