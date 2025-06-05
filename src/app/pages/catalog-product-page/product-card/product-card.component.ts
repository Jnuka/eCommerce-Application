import { Component, computed, inject, input, OnInit } from '@angular/core';
import { ProductProjectionResponse, ProductVariant } from '../../../products/products.interfaces';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { UserDataService } from '../../../data/services/user-data.service';

@Component({
  selector: 'app-product-card',
  imports: [NgIf, NgFor],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent implements OnInit {
  public product = input.required<ProductProjectionResponse>();
  public price: string | undefined;
  public discountPrice: string | undefined;
  public attributes: { name: string; degree: string }[] | undefined;
  public countAttributes = 1;

  public readonly isInCart = computed(() => {
    const ids = this.userDataService.productIdsFromCart();
    return ids.includes(this.product().id);
  });

  private router = inject(Router);
  private userDataService = inject(UserDataService);

  public ngOnInit(): void {
    this.getPrice();
    this.countAttributes = this.product().masterVariant.attributes.length;
    this.getAttributes();
  }

  public getAttributes(): void {
    if (this.countAttributes > 1) {
      // console.log('masters', this.masterVariant.attributes);
      // Атрибуты продуктов
      this.attributes = [{ name: '', degree: '' }];
      this.attributes.shift();
      for (let i = 0; i < 5; i++) {
        if (i === 3 || i === 4)
          this.attributes.push({
            ['name']: `${this.product().masterVariant.attributes[i].name}`,
            /* eslint-disable */
            ['degree']: `${this.product().masterVariant.attributes[i].value}`,
            /* eslint-enable */
          });
        else
          this.attributes.push({
            ['name']: `${this.product().masterVariant.attributes[i].name}`,
            ['degree']: `${this.product().masterVariant.attributes[i].value.label}`,
          });
      }
      /* eslint-disable */
      this.product().masterVariant.attributes[this.countAttributes - 1].value;
      /* eslint-enable */
    } else if (this.countAttributes === 1) {
      this.getAttributesForAccessories(this.product().masterVariant);
    }
  }

  public getAttributesForAccessories(variants: ProductVariant): void {
    // Атрибуты
    this.attributes = [{ name: '', degree: '' }];
    this.attributes.shift();
    /* eslint-disable */
    this.attributes.push({
      ['name']: `${variants.attributes[0].name}`,
      ['degree']: `${variants.attributes[0].value}`,
    });
    /* eslint-enable */
  }

  public getAttributesForCoffee(variants: ProductVariant): void {
    // Атрибут для веса
    /* eslint-disable */
    if (this.attributes) {
      this.attributes.filter(value => value.name === 'weight')[0].degree =
        `${variants.attributes[4].value}`;
    }
    /* eslint-enable */
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
