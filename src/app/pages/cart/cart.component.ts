import { Component, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { CartActionsService } from '../../cart/cart-actions.service';
import { LineItem } from '../../cart/cart-actions.interfaces';
import { CartItemComponent } from './cart-item/cart-item.component';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { ROUTES_PAGES } from '../../data/enums/routers';
import { UserDataService } from '../../data/services/user-data.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { ToastService } from '../../helpers/toast.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalWindowComponent } from '../../common-ui/confirm-modal-window/confirm-modal-window.component';
import { AuthService } from '../../auth/auth.service';
import { HeaderComponent } from '../../common-ui/header/header.component';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-cart',
  imports: [
    CartItemComponent,
    CurrencyPipe,
    FormsModule,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatFormField,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  public static cartItems = signal<LineItem[]>([]);
  public static total = 0;
  public cartId = '';
  public cartVersion = 1;
  public isDiscount = false;
  public idPromoCode = '';
  public codePromoCode = '';
  public promoCode = new FormControl('');
  public cartService = inject(CartActionsService);
  private userDataService = inject(UserDataService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);

  constructor() {
    if (this.authService.isAuth) {
      const userID = this.userDataService.customerData()?.customer.id;

      if (userID) {
        this.cartService.getCart(userID).subscribe(response => {
          CartComponent.cartItems.set(response.lineItems);
          CartComponent.total = response.totalPrice.centAmount;
        });
      }
      const cart = this.userDataService.customerData()?.cart;
      if (cart && cart.discountCodes) {
        if (cart.discountCodes.length !== 0) {
          this.isDiscount = true;
          this.cartService
            .getPromoCodeById(cart.discountCodes[0].discountCode.id)
            .subscribe(response => {
              this.promoCode.setValue(response.code);
            });
        }
      }
    } else {
      this.cartService.getAnonymousCart().subscribe(response => {
        CartComponent.cartItems.set(response.lineItems);
        CartComponent.total = response.totalPrice.centAmount;
        if (response.discountCodes) {
        if (response.discountCodes.length !== 0) {
          this.isDiscount = true;
          this.cartService
            .getPromoCodeById(response.discountCodes[0].discountCode.id)
            .subscribe(response => {
              this.promoCode.setValue(response.code);
            });
        }
      }
      });
  }

  // eslint-disable-next-line class-methods-use-this
  public get totalPrice(): number {
    return CartComponent.total;
  }

  // eslint-disable-next-line class-methods-use-this
  public get cartItems(): WritableSignal<LineItem[]> {
    return CartComponent.cartItems;
  }

  public onSubmit(): void {
    const code = this.promoCode.value;
    if (code) {
      this.addPromoCode(code);
    }
  }

  public deletePromo(): void {
    const code = this.promoCode.value;
    if (code) {
      this.removePromoCode(code);
    }
  }

  public goCatalog(): void {
    void this.router.navigate([ROUTES_PAGES.CATALOG]);
  }

  public clearCart(): void {
    if (this.authService.isAuth) {
      const cart = this.userDataService.customerData()?.cart;
      if (cart) {
        this.cartId = cart?.id;
        this.cartVersion = cart?.version;
      }
    } else {
      this.cartService.anonymousCart.subscribe(response => {
        if (response) {
          this.cartId = response.id;
          this.cartVersion = response.version;
        }
      });
    }
    const itemArray = CartComponent.cartItems();

    if (this.cartId && this.cartVersion != null) {
      this.cartService.clearCart(this.cartId, this.cartVersion, itemArray).subscribe(response => {
        CartComponent.cartItems.set(response.lineItems);
        CartComponent.total = response.totalPrice.centAmount;
        if (!this.authService.isAuth) {
          this.cartService.anonymousCart$.next(response);
        } else {
          HeaderComponent.quantityIndicator = response.totalLineItemQuantity;
          this.userDataService.refreshCustomerData();
        }
      });
    }
  }

  public addPromoCode(promo: string): void {
    const cart = this.userDataService.customerData()?.cart;
    const cartId = cart?.id;

    const version = cart?.version;
    this.cartService.getPromoCodeByKey(promo).subscribe({
      next: response => {
        this.codePromoCode = response.code;
        if (cartId && version != null) {
          this.cartService
            .addDiscountCode(cartId, version, this.codePromoCode)
            .subscribe(response => {
              CartComponent.cartItems.set(response.lineItems);
              CartComponent.total = response.totalPrice.centAmount;
              this.userDataService.refreshCustomerData();
              this.isDiscount = true;
            });
        }
      },
      error: () => {
        this.toastService.error(`Promo code ${this.promoCode.value} not found`);
      },
    });
  }

  public removePromoCode(promo: string): void {
    const cart = this.userDataService.customerData()?.cart;
    const cartId = cart?.id;

    const version = cart?.version;
    this.cartService.getPromoCodeByKey(promo).subscribe({
      next: response => {
        this.idPromoCode = response.id;
        if (cartId && version != null) {
          this.cartService
            .removeDiscountCode(cartId, version, this.idPromoCode)
            .subscribe(response => {
              CartComponent.cartItems.set(response.lineItems);
              CartComponent.total = response.totalPrice.centAmount;
              this.userDataService.refreshCustomerData();
              this.isDiscount = false;
              this.promoCode.setValue('');
            });
        }
      },
      error: () => {
        this.toastService.error(`Promo code ${this.promoCode.value} not found`);
      },
    });
  }

  public openDialog(): void {
    this.dialog.open(ConfirmModalWindowComponent);
  }
}
