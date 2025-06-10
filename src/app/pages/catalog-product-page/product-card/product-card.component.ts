import { Component, computed, inject, input, OnInit } from '@angular/core';
import { ProductProjectionResponse, ProductVariant } from '../../../products/products.interfaces';
import { Router } from '@angular/router';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { UserDataService } from '../../../data/services/user-data.service';
import { ROUTES_PAGES } from '../../../data/enums/routers';
import { BehaviorSubject } from 'rxjs';
import { CartActionsService } from '../../../cart/cart-actions.service';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, NgIf, NgFor],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent implements OnInit {
  public product = input.required<ProductProjectionResponse>();
  public price: string | undefined;
  public discountPrice: string | undefined;
  public attributes: { name: string; degree: string }[] | undefined;
  public countAttributes = 1;
  public isAddingToCart$ = new BehaviorSubject<boolean>(false);

  public readonly isInCart = computed(() => {
    const productId = this.product().id?.toString();
    const cartProductIds = this.userDataService.productIdsFromCart().map(id => id.toString());

    return cartProductIds.includes(productId);
  });

  private router = inject(Router);
  private userDataService = inject(UserDataService);
  private cartService = inject(CartActionsService);

  public ngOnInit(): void {
    this.getPrice();
    this.countAttributes = this.product().masterVariant.attributes.length;
    this.getAttributes();
  }

  public addToCart(event: Event): void {
    event.stopPropagation();
    const cart = this.userDataService.customerData()?.cart;
    const cartId = cart?.id;
    const version = cart?.version;
    const productId = this.product().id;
    const variantId = this.product().masterVariant.id;

    if (cartId && version != null) {
      this.isAddingToCart$.next(true);
      this.cartService.addToCart(cartId, version, productId, variantId, 1).subscribe({
        next: () => {
          this.userDataService.refreshCustomerData();
          this.isAddingToCart$.next(false);
        },
        error: () => {
          this.isAddingToCart$.next(false);
        },
      });
    }
  }

  public getAttributes(): void {
    if (this.countAttributes > 1) {
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

  public goDetailedProduct(id: string): void {
    void this.router.navigate([ROUTES_PAGES.PRODUCT], {
      queryParams: { productId: id },
    });
  }
}
