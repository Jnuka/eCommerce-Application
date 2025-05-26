import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-catalog-product-page',
  templateUrl: './catalog-product-page.component.html',
  styleUrl: './catalog-product-page.component.css',
})
export class CatalogProductPageComponent {
  private router = inject(Router);

  public async goDetailedProduct(id: string): Promise<void> {
    await this.router.navigate(['product'], {
      queryParams: { productId: id },
    });
  }
}
