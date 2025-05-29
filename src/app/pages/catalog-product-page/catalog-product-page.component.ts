import { Component, inject, signal, OnInit } from '@angular/core';
import { ProductProjectionResponse } from '../../products/products.interfaces';
import { ProductsService } from '../../products/products.service';
import { ProductCardComponent } from './product-card/product-card.component';

@Component({
  selector: 'app-catalog-product-page',
  templateUrl: './catalog-product-page.component.html',
  styleUrl: './catalog-product-page.component.css',
  imports: [ProductCardComponent],
})
export class CatalogProductPageComponent implements OnInit {
  public products = signal<ProductProjectionResponse[]>([]);

  public productService = inject(ProductsService);

  public ngOnInit(): void {
    this.renderProducts();
  }

  public renderProducts(): void {
    this.productService.getAllProducts().subscribe(response => {
      this.products.set(response.results);
    });
  }
}
