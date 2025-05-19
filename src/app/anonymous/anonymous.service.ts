import { inject, Injectable } from '@angular/core';
import { HttpHeaders, HttpParams, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { tap, catchError, throwError, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AnonymousTokenResponse } from './anonymous.interfaces';
import { CookieService } from 'ngx-cookie-service';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class AnonymousService {
  private http = inject(HttpClient);
  private cookieService = inject(CookieService);

  private anonymousToken: string | null = null;
  private refreshToken: string | null = null;
  private anonymousId: string;

  constructor() {
    const savedId = this.cookieService.get('anonymous_id');
    this.anonymousId = savedId || uuidv4();
    if (!savedId) {
      this.cookieService.set('anonymous_id', this.anonymousId);
    }
    this.anonymousToken = this.cookieService.get('anonymous_token') || null;
    this.refreshToken = this.cookieService.get('anonymous_refresh_token') || null;
  }

  public get isAnonymousAuth(): boolean {
    return !!this.anonymousToken;
  }

  public getAnonymousId(): string {
    return this.anonymousId;
  }

  public getToken(): string | null {
    return this.anonymousToken;
  }

  public getRefreshToken(): string | null {
    return this.refreshToken;
  }

  public authenticate(): Observable<AnonymousTokenResponse> {
    const authHeader = btoa(`${environment.ctp_client_id}:${environment.ctp_client_secret}`);
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${authHeader}`,
    });

    const scopes = ['view_published_products', 'manage_orders']
      .map(scope => `${scope}:${environment.ctp_project_key}`)
      .join(' ');

    const body = new HttpParams()
      .set('grant_type', 'client_credentials')
      .set('scope', `${scopes}`)
      .set('anonymous_id', `${this.anonymousId}`);

    return this.http
      .post<AnonymousTokenResponse>(
        `${environment.ctp_auth_url}/oauth/${environment.ctp_project_key}/anonymous/token`,
        body,
        { headers },
      )
      .pipe(
        tap(response => {
          this.anonymousToken = response.access_token;
          this.refreshToken = response.refresh_token;
          this.cookieService.set('anonymous_token', this.anonymousToken);
          this.cookieService.set('anonymous_refresh_token', this.refreshToken);
        }),
        catchError((error: HttpErrorResponse) => {
          console.log('Authorization cannot be done anonymously'); // eslint-disable-line no-console
          return throwError(() => error);
        }),
      );
  }

  public refreshAnonymousToken(): Observable<AnonymousTokenResponse> {
    if (!this.refreshToken) {
      return throwError(() => new Error('No refresh token for anonymous session'));
    }

    const authHeader = btoa(`${environment.ctp_client_id}:${environment.ctp_client_secret}`);
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${authHeader}`,
    });

    const body = new HttpParams()
      .set('grant_type', 'refresh_token')
      .set('refresh_token', this.refreshToken);

    return this.http
      .post<AnonymousTokenResponse>(`${environment.ctp_auth_url}/oauth/token`, body, { headers })
      .pipe(
        tap(response => {
          this.anonymousToken = response.access_token;
          this.refreshToken = response.refresh_token;
          this.cookieService.set('anonymous_token', this.anonymousToken);
          this.cookieService.set('anonymous_refresh_token', this.refreshToken);
        }),
        catchError((error: HttpErrorResponse) => {
          this.logout();
          return throwError(() => error);
        }),
      );
  }

  public logout(): void {
    this.anonymousToken = null;
    this.refreshToken = null;
    this.anonymousId = '';
    this.cookieService.delete('anonymous_token');
    this.cookieService.delete('anonymous_refresh_token');
  }
}
