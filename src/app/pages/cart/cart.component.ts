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
  public isDiscount = false;
  public idPromoCode = '';
  public codePromoCode = '';

  public promoCode = new FormControl('');

  public cartService = inject(CartActionsService);
  private userDataService = inject(UserDataService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private dialog = inject(MatDialog);

  constructor() {
    this.cartService.getCart().subscribe(response => {
      CartComponent.cartItems.set(response.lineItems);
      CartComponent.total = response.totalPrice.centAmount;
    });
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
    const cart = this.userDataService.customerData()?.cart;
    const cartId = cart?.id;
    const version = cart?.version;
    const itemArray = CartComponent.cartItems();

    if (cartId && version != null) {
      this.cartService.clearCart(cartId, version, itemArray).subscribe(response => {
        CartComponent.cartItems.set(response.lineItems);
        CartComponent.total = response.totalPrice.centAmount;
        this.userDataService.refreshCustomerData();
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
