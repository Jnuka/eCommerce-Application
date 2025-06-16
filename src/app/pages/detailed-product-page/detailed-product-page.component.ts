import { Component, inject, OnInit } from '@angular/core';
import {
  ProductResponse,
  ProductVariant,
  ProductVariants,
} from '../../products/products.interfaces';
import { ProductsService } from '../../products/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import {
  MatButtonToggle,
  MatButtonToggleChange,
  MatButtonToggleGroup,
} from '@angular/material/button-toggle';
import { SliderInterface } from '../../common-ui/interfaces/slider.interface';
import { ImageSliderComponent } from '../../common-ui/image-slider/image-slider.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalWindowComponent } from '../../common-ui/modal-window/modal-window.component';
import { BehaviorSubject, combineLatest, map, switchMap, take } from 'rxjs';
import { ROUTES_PAGES } from '../../data/enums/routers';
import { CATEGORIES } from '../../data/enums/categories';
import { SUB_CATEGORIES } from '../../data/enums/subCategories';
import { VERIFICATION_PURPOSES } from '../../data/enums/verificationPurposes';
import { CartActionsService } from '../../cart/cart-actions.service';
import { UserDataService } from '../../data/services/user-data.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { AuthService } from '../../auth/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { CartComponent } from '../cart/cart.component';
import { ToastService } from '../../helpers/toast.service';

@Component({
  selector: 'app-detailed-product-page',
  templateUrl: './detailed-product-page.component.html',
  styleUrl: './detailed-product-page.component.css',
  imports: [NgIf, NgForOf, MatButtonToggleGroup, MatButtonToggle, ImageSliderComponent, AsyncPipe],
})
export class DetailedProductPageComponent implements OnInit {
  public readonly CATEGORIES = CATEGORIES;
  public readonly SUB_CATEGORIES = SUB_CATEGORIES;

  public isAddingToCart$ = new BehaviorSubject<boolean>(false);
  public isDeleteFromCart$ = new BehaviorSubject<boolean>(false);

  public pageNum: string | null = '';
  public description = '';
  public products: ProductResponse | undefined;

  public srcImage: SliderInterface[] = [];
  public totalPrice: string | undefined;
  public discount: string | undefined;
  public attributes: { name: string; degree: string }[] | undefined;

  public countAttributes = 1;
  public masterVariant: ProductVariant | undefined;
  public variants: ProductVariant[] | undefined;
  public whichCategory = '';

  public productService = inject(ProductsService);
  public productsValues: ProductVariants[] = [{ id: 0, variant: '', value: '' }];
  public toggleButtonValue: string | number | undefined;
  public toggleButtonId: string | undefined;
  public isProductInCart = false;

  public userDataService = inject(UserDataService);
  public cartService = inject(CartActionsService);

  public isInCart = combineLatest([
    this.cartService.anonymousCart,
    toObservable(this.userDataService.customerCart$),
  ]).pipe(
    map(([anonymousCart, customerCart]) => {
      if (this.authService.isAuth && customerCart) {
        const toggleVariant = this.toggleButtonId ? this.toggleButtonId : 1;
        return (
          customerCart.lineItems &&
          customerCart.lineItems.filter(
            product =>
              product.productId === this.pageNum && product.variant.id === Number(toggleVariant),
          ).length > 0
        );
      }
      if (!anonymousCart) {
        return false;
      }

      const toggleVariant = this.toggleButtonId ? this.toggleButtonId : 1;
      return (
        anonymousCart.lineItems &&
        anonymousCart.lineItems.filter(
          product =>
            product.productId === this.pageNum && product.variant.id === Number(toggleVariant),
        ).length > 0
      );
    }),
  );

  private router = inject(Router);
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);
  private cookieService = inject(CookieService);
  private toastService = inject(ToastService);

  constructor(private activatedRoute: ActivatedRoute) {}

  public ngOnInit(): void {
    this.pageNum = this.activatedRoute.snapshot.queryParamMap.get('productId');
    if (this.pageNum !== null) {
      this.renderProduct(this.pageNum);
      this.isInCart.subscribe(result => (this.isProductInCart = result));
    }
  }

  public addProductToCart(cartId: string, cartVersion: number): void {
    if (this.products) {
      const variantId = this.getVariantId();
      const productId = this.products.id;

      this.cartService.addToCart(cartId, cartVersion, productId, variantId, 1).subscribe({
        next: () => {
          this.userDataService.refreshCustomerData();
          this.isAddingToCart$.next(false);
          this.isProductInCart = true;
          this.toastService.success('Product Added');
        },
        error: () => {
          this.isAddingToCart$.next(false);
          this.isProductInCart = false;
        },
      });
    }
  }

  public getVariantId(): string {
    if (this.products) {
      for (let i = 0; i < this.productsValues.length; i++) {
        if (this.productsValues[i].value === this.toggleButtonValue) {
          if (this.productsValues[i].variant === VERIFICATION_PURPOSES.masterVariant) {
            return this.products.masterData.current.masterVariant.id;
          } else {
            return this.products.masterData.current.variants[i - 1].id;
          }
        }
      }
    }
    return '';
  }

  public addToCart(event: Event): void {
    event.stopPropagation();

    this.isAddingToCart$.next(true);

    const email = this.cookieService.get('user_email');
    const password = this.cookieService.get('user_password');
    const anonymousId = this.cookieService.get('anonymous_id');

    if (this.products) {
      const productId = this.products.id;
      const variantId = this.getVariantId();

      if (this.authService.isAuth) {
        const cart = this.userDataService.customerData()?.cart;
        if (cart) {
          this.addProductToCart(cart.id, cart.version);
        } else {
          this.cartService.createCart({ currency: 'USD' }, email, password).subscribe({
            next: () => {
              const cart = this.userDataService.customerData()?.cart;
              if (cart) {
                this.addProductToCart(cart.id, cart.version);
              } else {
                this.toastService.success('Product Added');
                this.isAddingToCart$.next(false);
                this.isProductInCart = true;
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
                return this.cartService.addToCart(cart.id, cart.version, productId, variantId, 1);
              } else {
                return this.cartService
                  .createAnonymousCart({ currency: 'USD', anonymousId })
                  .pipe(
                    switchMap(response =>
                      this.cartService.addToCart(
                        response.id,
                        response.version,
                        productId,
                        variantId,
                        1,
                      ),
                    ),
                  );
              }
            }),
          )
          .subscribe({
            next: () => {
              this.userDataService.refreshCustomerData();
              this.isAddingToCart$.next(false);
              this.isProductInCart = true;
              this.toastService.success('Product Added');
            },
            error: () => {
              this.isAddingToCart$.next(false);
              this.isProductInCart = false;
            },
          });
      }
    }
  }

  public removeFromCart(event: Event): void {
    event.stopPropagation();
    this.isDeleteFromCart$.next(true);
    const toggleVariant = this.toggleButtonId ? this.toggleButtonId : 1;

    const cart = this.userDataService.customerData()?.cart;
    if (cart) {
      const cartId = cart.id;
      const version = cart.version;
      const cartProductId = cart.lineItems
        .filter(
          product =>
            product.productId === this.pageNum && product.variant.id === Number(toggleVariant),
        )
        .map(product => product.id)
        .join('');
      if (this.products) {
        if (cartId && version != null) {
          this.cartService.removeFromCart(cartId, version, cartProductId, 1).subscribe(response => {
            CartComponent.cartItems.set(response.lineItems);
            CartComponent.total = response.totalPrice.centAmount;
            this.userDataService.refreshCustomerData();
            this.isDeleteFromCart$.next(false);
            this.toastService.error('Product Removed');
          });
        }
      }
    }
  }

  public changeInToggleGroup(event: MatButtonToggleChange): void {
    if (typeof event.value === 'string') {
      this.toggleButtonValue = event.value;
      if (this.toggleButtonValue !== undefined) {
        this.toggleSwitch(this.toggleButtonValue);
      }
      this.toggleButtonId = event.source.id;
      this.isInCart.subscribe(result => (this.isProductInCart = result));
    }
  }

  public renderProduct(id: string): void {
    this.productService
      .getProductById(id)
      .pipe(
        map(product => {
          this.countAttributes = product.masterData.current.masterVariant.attributes.length;
          this.masterVariant = product.masterData.current.masterVariant;
          this.variants = product.masterData.current.variants;
          this.products = product;
          this.getParameters();
        }),
      )
      .subscribe();
  }

  public toggleSwitch(toggleButtonValue?: string | number): void {
    if (this.masterVariant && this.variants && this.products) {
      /* eslint-disable */
      if (
        toggleButtonValue === String(this.masterVariant.attributes[this.countAttributes - 1].value)
      ) {
        this.getAttributes(this.masterVariant);
        if (this.countAttributes > 1) {
          this.getAttributesForCoffee(this.masterVariant);
        } else {
          this.getAttributesForAccessories(this.masterVariant);
        }
      } else {
        for (const variant of this.variants) {
          if (toggleButtonValue === String(variant.attributes[this.countAttributes - 1].value)) {
            this.getAttributes(variant);
            if (this.countAttributes > 1) {
              this.getAttributesForCoffee(variant);
            } else {
              this.getAttributesForAccessories(variant);
            }
          }
        }
      }
      /* eslint-enable */
    }
  }

  public getParameters(): void {
    if (this.masterVariant && this.variants && this.products) {
      if (this.masterVariant.attributes[0].name === VERIFICATION_PURPOSES.nameValue) {
        this.productsValues.push({
          id: 1,
          variant: 'masterVariant',
          /* eslint-disable */
          value: String(this.masterVariant.attributes[0].value),
          /* eslint-enable */
        });
        if (this.variants.length > 0) {
          for (let i = 0; i < this.variants.length; i++) {
            this.productsValues.push({
              id: i + 2,
              variant: i,
              /* eslint-disable */
              value: String(this.variants[i].attributes[0].value),
              /* eslint-enable */
            });
          }
        }
      } else {
        this.productsValues.push({
          id: 1,
          variant: 'masterVariant',
          /* eslint-disable */
          value: String(this.masterVariant.attributes[4].value),
          /* eslint-enable */
        });
        if (this.variants.length > 0) {
          for (let i = 0; i < this.variants.length; i++) {
            this.productsValues.push({
              id: i + 2,
              variant: i,
              /* eslint-disable */
              value: String(this.variants[i].attributes[4].value),
              /* eslint-enable */
            });
          }
        }
      }
      this.productsValues.shift();
      this.toggleButtonValue = this.productsValues[0].value;
      this.description = this.products.masterData.current.description['en-US'];
      this.description = this.shortDescription();
      this.description += '...';
      // Определние категории
      if (
        this.masterVariant.attributes.length === 1 ||
        this.masterVariant.attributes.length === 0
      ) {
        if (this.products.masterData.current.name['en-US'] === 'French press') {
          this.whichCategory = CATEGORIES.FRENCH;
        } else if (this.products.masterData.current.name['en-US'] === 'Filters for aeropress') {
          this.whichCategory = CATEGORIES.AERO_PRESS;
        } else if (this.products.masterData.current.name['en-US'] === 'Coffee grinder') {
          this.whichCategory = CATEGORIES.GRINDER;
        }
      } else {
        this.whichCategory = CATEGORIES.COFFEE;
      }
      // Картинки
      this.srcImage = [];
      for (const img of this.masterVariant.images) {
        this.srcImage.push({
          url: `${img.url}`,
          alt: `${img.label}`,
        });
      }
      // Цена продукта
      this.totalPrice = new Intl.NumberFormat('en', {
        style: 'currency',
        currency: 'USD',
      }).format(this.masterVariant.prices[0].value.centAmount / 100);
      // Скидка на продукт, если есть
      if (this.masterVariant.prices[0].discounted) {
        this.discount = new Intl.NumberFormat('en', {
          style: 'currency',
          currency: 'USD',
        }).format(this.masterVariant.prices[0].discounted.value.centAmount / 100);
      }

      if (this.countAttributes > 1) {
        // Атрибуты продуктов
        this.attributes = [{ name: '', degree: '' }];
        this.attributes.shift();
        for (let i = 0; i < 5; i++) {
          if (i === 3 || i === 4)
            this.attributes.push({
              ['name']: `${this.masterVariant.attributes[i].name}`,
              /* eslint-disable */
              ['degree']: `${this.masterVariant.attributes[i].value}`,
              /* eslint-enable */
            });
          else
            this.attributes.push({
              ['name']: `${this.masterVariant.attributes[i].name}`,
              ['degree']: `${this.masterVariant.attributes[i].value.label}`,
            });
        }
        /* eslint-disable */
        this.masterVariant.attributes[this.countAttributes - 1].value;
        /* eslint-enable */
      } else if (this.countAttributes === 1) {
        this.getAttributesForAccessories(this.masterVariant);
      }
    }
  }

  public getAttributes(variants: ProductVariant): void {
    // Картинка
    this.srcImage = [];
    for (const img of variants.images) {
      this.srcImage.push({
        url: `${img.url}`,
        alt: `${img.label}`,
      });
    }
    // Цена продукта
    this.totalPrice = new Intl.NumberFormat('en', {
      style: 'currency',
      currency: 'USD',
    }).format(variants.prices[0].value.centAmount / 100);
    // Скидка на продукт, если есть
    if (variants.prices[0].discounted) {
      this.discount = new Intl.NumberFormat('en', {
        style: 'currency',
        currency: 'USD',
      }).format(variants.prices[0].discounted.value.centAmount / 100);
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

  public shortDescription(): string {
    return this.description.substring(0, this.description.length * (1 - 60 / 100));
  }

  public moreDescription(): void {
    if (this.products) {
      this.description = this.products.masterData.current.description['en-US'];
    }
    const moreButton = document.querySelector('.more-btn');
    if (moreButton instanceof HTMLElement) {
      moreButton.classList.add('hidden-more-btn');
    }
  }

  public goCatalog(): void {
    void this.router.navigate([ROUTES_PAGES.CATALOG]);
  }

  public goCategory(category: string): void {
    void this.router.navigate([ROUTES_PAGES.CATALOG], {
      queryParams: { categories: category },
    });
  }
  public goType(type: string): void {
    void this.router.navigate([ROUTES_PAGES.CATALOG], {
      queryParams: { categories: CATEGORIES.COFFEE, type: type },
    });
  }

  public goAccessories(): void {
    void this.router.navigate([ROUTES_PAGES.CATALOG], {
      queryParams: { categories: CATEGORIES.ACCESSORIES },
    });
  }

  public goHome(): void {
    void this.router.navigate(['']);
  }

  public openDialog(): void {
    this.dialog.open(ModalWindowComponent, {
      data: this.srcImage,
    });
  }
}
