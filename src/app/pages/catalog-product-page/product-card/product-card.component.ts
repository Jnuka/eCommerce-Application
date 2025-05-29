import { Component, inject, input, OnInit } from '@angular/core';
import { ProductProjectionResponse } from '../../../products/products.interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent implements OnInit {
  public product = input.required<ProductProjectionResponse>();
  public price: string | undefined;
  public discountPrice: string | undefined;

  private router = inject(Router);

  public ngOnInit(): void {
    this.getPrice();
  }

  public getPrice(): void {
    if (this.product()) {
      this.price = new Intl.NumberFormat('en', { style: 'currency', currency: 'USD' }).format(
        this.product().masterVariant.prices[0].value.centAmount / 100,
      );
      if (this.product().masterVariant.prices[0].discounted) {
        this.discountPrice = new Intl.NumberFormat('en', {
          style: 'currency',
          currency: 'USD',
        }).format(this.product().masterVariant.prices[0].discounted.value.centAmount / 100);
      }
    }
  }

  public async goDetailedProduct(id: string): Promise<void> {
    await this.router.navigate(['product'], {
      queryParams: { productId: id },
    });
  }
}
