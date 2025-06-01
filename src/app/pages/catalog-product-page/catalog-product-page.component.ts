import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryResponse, TypeResponse } from '../../products/products.interfaces';
import { ProductsService } from '../../products/products.service';

@Component({
  selector: 'app-catalog-product-page',
  templateUrl: './catalog-product-page.component.html',
  styleUrl: './catalog-product-page.component.css',
})
export class CatalogProductPageComponent implements OnInit {
  public currentPage = 'Catalog';
  public currentType = '';
  public currentCategory = '';

  public productService = inject(ProductsService);
  public types: TypeResponse[] = [];
  public categories: CategoryResponse[] = [];

  private router = inject(Router);

  public ngOnInit(): void {
    this.getCategoriesInfo();
  }

  public goCatalog(): void {
    this.currentPage = 'Catalog';
    this.currentType = '';
    this.currentCategory = '';
    //await this.router.navigate(['catalog']);
  }

  public async goHome(): Promise<void> {
    await this.router.navigate(['']);
  }

  public showProductsFromType(type: string): void {
    this.currentPage = type;
    this.currentType = type;
    this.currentCategory = '';
  }

  public showProductsFromCategory(category: string): void {
    this.currentPage = category;
    if (category.slice(0, 6) === 'Coffee') {
      this.currentType = 'Coffee';
    } else {
      this.currentType = 'Accessories';
    }
    this.currentCategory = category;
  }

  public getCategoriesInfo(): void {
    this.productService.getTypes().subscribe(response => {
      this.types = response.results;
    });

    this.productService.getCategories().subscribe(response => {
      this.categories = response.results;
    });
  }

  public async goDetailedProduct(id: string): Promise<void> {
    await this.router.navigate(['product'], {
      queryParams: { productId: id },
    });
  }
}
