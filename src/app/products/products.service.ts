import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductResponse } from './products.interfaces';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  public http = inject(HttpClient);
  private cookieService = inject(CookieService);
  private cookieToken: string | null = null;

  public getProductById(productId: string): Observable<ProductResponse> {
    this.cookieToken = this.cookieService.get('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieToken}`,
    });
    return this.http.get<ProductResponse>(
      `${environment.ctp_api_url}/${environment.ctp_project_key}/products/${productId}`,
      { headers },
    );
  }
}
