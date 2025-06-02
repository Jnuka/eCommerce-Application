import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  ListResponse,
  ProductListResponse,
  ProductResponse,
  SearchResponse,
} from './products.interfaces';
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

  public getTypes(): Observable<ListResponse> {
    this.cookieToken = this.cookieService.get('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieToken}`,
    });
    return this.http.get<ListResponse>(
      `${environment.ctp_api_url}/${environment.ctp_project_key}/product-types`,
      { headers },
    );
  }

  public getCategories(): Observable<ListResponse> {
    this.cookieToken = this.cookieService.get('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieToken}`,
    });
    return this.http.get<ListResponse>(
      `${environment.ctp_api_url}/${environment.ctp_project_key}/categories`,
      { headers },
    );
  }

  public getProducts(filter: string): Observable<ProductListResponse> {
    this.cookieToken = this.cookieService.get('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieToken}`,
    });
    return this.http.get<ProductListResponse>(
      `${environment.ctp_api_url}/${environment.ctp_project_key}/product-projections/search?${filter}`,
      { headers },
    );
  }

  public getProductsBySearch(filter: string): Observable<SearchResponse> {
    this.cookieToken = this.cookieService.get('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieToken}`,
    });
    return this.http.get<SearchResponse>(
      `${environment.ctp_api_url}/${environment.ctp_project_key}/product-projections/suggest?${filter}`,
      { headers },
    );
  }

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
