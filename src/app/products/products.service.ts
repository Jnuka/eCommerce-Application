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

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  public http = inject(HttpClient);
  private accessToken = `fUkqKHeCG3oCjV3p-8hq4e9cP-xLwzfZ`;
  // private cookieService = inject(CtpApiService);
  // private tokenAccess: string | null = '';

  public getTypes(): Observable<ListResponse> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`,
    });
    return this.http.get<ListResponse>(
      `${environment.ctp_api_url}/${environment.ctp_project_key}/product-types`,
      { headers },
    );
  }
  // public getTypes(): Observable<ListResponse> {
  //   return this.cookieService.getAccessToken()
  //     .pipe(
  //       switchMap((value, index) => {
  //           this.tokenAccess = value;
  //           const headers = new HttpHeaders({
  //             'Authorization': `Bearer ${value}`,
  //           });
  //           return this.http.get<ListResponse>(
  //             `${environment.ctp_api_url}/${environment.ctp_project_key}/product-types`,
  //             { headers },
  //           );
  //         }
  //       )
  //     );
  // }

  public getCategories(): Observable<ListResponse> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`,
    });
    return this.http.get<ListResponse>(
      `${environment.ctp_api_url}/${environment.ctp_project_key}/categories`,
      { headers },
    );
  }

  public getProducts(filter: string): Observable<ProductListResponse> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`,
    });
    return this.http.get<ProductListResponse>(
      `${environment.ctp_api_url}/${environment.ctp_project_key}/product-projections/search?${filter}`,
      { headers },
    );
  }

  public getProductsBySearch(filter: string): Observable<SearchResponse> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`,
    });
    return this.http.get<SearchResponse>(
      `${environment.ctp_api_url}/${environment.ctp_project_key}/product-projections/suggest?${filter}`,
      { headers },
    );
  }

  public getProductById(productId: string): Observable<ProductResponse> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`,
    });
    return this.http.get<ProductResponse>(
      `${environment.ctp_api_url}/${environment.ctp_project_key}/products/${productId}`,
      { headers },
    );
  }
}
