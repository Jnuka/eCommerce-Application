import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AccessTokenResponse } from '../interfaces/ctp-api.interface';

@Injectable({
  providedIn: 'root'
})
export class CtpApiService {
  private http = inject(HttpClient);
  private accessToken$ = new BehaviorSubject<string | null>(null);
  
  constructor() {
    this.initAccessToken();
  }

  private initAccessToken(): void {
    const scopeString = environment.ctp_scopes.join(' ');

    const body = new HttpParams()
      .set('grant_type', 'client_credentials')
      .set('scope', scopeString);
    
    const authHeader = btoa(`${environment.ctp_client_id}:${environment.ctp_client_secret}`);
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${authHeader}`
    });

    this.http.post<AccessTokenResponse>(`${environment.ctp_auth_url}/oauth/token`, body, { headers })
    .subscribe({
      next: res => this.accessToken$.next(res.access_token),
      error: err => console.error('Error receiving token', err)
    })
  }

  getAccessToken() {
    return this.accessToken$.asObservable();
  }
}

