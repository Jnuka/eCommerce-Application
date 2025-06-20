import { Component, inject, input, OnInit } from '@angular/core';
import { ProductProjectionResponse, ProductVariant } from '../../../products/products.interfaces';
import { Router } from '@angular/router';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { UserDataService } from '../../../data/services/user-data.service';
import { ROUTES_PAGES } from '../../../data/enums/routers';
import { BehaviorSubject, combineLatest, map, switchMap, take } from 'rxjs';
import { CartActionsService } from '../../../cart/cart-actions.service';
import { AuthService } from '../../../auth/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { toObservable } from '@angular/core/rxjs-interop';
import { Action } from '../../../cart/cart-actions.interfaces';

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
  public cartService = inject(CartActionsService);
  public userDataService = inject(UserDataService);

  public isInCart$ = combineLatest([
    this.cartService.anonymousCart,
    toObservable(this.userDataService.customerCart$),
  ]).pipe(
    map(([anonymousCart, customerCart]) => {
      const productId = this.product().id?.toString();

      if (this.authService.isAuth && customerCart) {
        const productIds = customerCart.lineItems.map(item => item.productId.toString());
        return productId ? productIds.includes(productId) : false;
      }

      if (!anonymousCart) return false;

      const productIds = anonymousCart.lineItems.map(item => item.productId.toString());
      return productId ? productIds.includes(productId) : false;
    }),
  );

  private router = inject(Router);
  private authService = inject(AuthService);
  private cookieService = inject(CookieService);

  public ngOnInit(): void {
    this.countAttributes = this.product().masterVariant.attributes.length;
    this.getAttributes();
  }

  public addToCart(event: Event): void {
    event.stopPropagation();
    this.isAddingToCart$.next(true);

    const productId = this.product().id;
    const variantId = this.product().masterVariant.id;
    const email = this.cookieService.get('user_email');
    const password = this.cookieService.get('user_password');
    const anonymousId = this.cookieService.get('anonymous_id');
    const actions: Action[] = [
      {
        action: 'addLineItem',
        productId,
        variantId: Number(variantId),
        quantity: 1,
      },
    ];

    if (this.authService.isAuth) {
      const cart = this.userDataService.customerData()?.cart;
      if (cart) {
        this.addProductToCart();
      } else {
        this.cartService.createCart({ currency: 'USD' }, email, password).subscribe({
          next: () => {
            const cart = this.userDataService.customerData()?.cart;
            if (cart) {
              this.addProductToCart();
            } else {
              this.isAddingToCart$.next(false);
            }
          },
          error: () => this.isAddingToCart$.next(false),
        });
      }
    } else {
      this.cartService.anonymousCart
        .pipe(
          take(1),
          switchMap(cart => {
            if (cart) {
              return this.cartService.UpdateCart(actions);
            } else {
              return this.cartService
                .createAnonymousCart({ currency: 'USD', anonymousId })
                .pipe(switchMap(() => this.cartService.UpdateCart(actions)));
            }
          }),
        )
        .subscribe({
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

  public goDetailedProduct(id: string): void {
    void this.router.navigate([ROUTES_PAGES.PRODUCT], {
      queryParams: { productId: id },
    });
  }

  private addProductToCart(): void {
    const productId = this.product().id;
    const variantId = this.product().masterVariant.id;

    const actions: Action[] = [
      {
        action: 'addLineItem',
        productId,
        variantId: Number(variantId),
        quantity: 1,
      },
    ];

    this.cartService.UpdateCart(actions).subscribe({
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
