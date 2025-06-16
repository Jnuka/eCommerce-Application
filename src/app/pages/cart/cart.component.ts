import { Component, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { CartActionsService } from '../../cart/cart-actions.service';
import { LineItem } from '../../cart/cart-actions.interfaces';
import { CartItemComponent } from './cart-item/cart-item.component';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { ROUTES_PAGES } from '../../data/enums/routers';
import { UserDataService } from '../../data/services/user-data.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalWindowComponent } from '../../common-ui/confirm-modal-window/confirm-modal-window.component';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-cart',
  imports: [CartItemComponent, CurrencyPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  public static cartItems = signal<LineItem[]>([]);
  public static total = 0;
  public cartId = '';
  public cartVersion = 1;
  public cartService = inject(CartActionsService);
  private userDataService = inject(UserDataService);
  private router = inject(Router);
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
    } else {
      this.cartService.getAnonymousCart().subscribe(response => {
        CartComponent.cartItems.set(response.lineItems);
        CartComponent.total = response.totalPrice.centAmount;
      });
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
          this.userDataService.refreshCustomerData();
        }
      });
    }
    const itemArray = CartComponent.cartItems();

    if (this.cartId && this.cartVersion != null) {
      this.cartService.clearCart(this.cartId, this.cartVersion, itemArray).subscribe(response => {
        CartComponent.cartItems.set(response.lineItems);
        CartComponent.total = response.totalPrice.centAmount;
        this.userDataService.refreshCustomerData();
      });
    }
  }

  public openDialog(): void {
    this.dialog.open(ConfirmModalWindowComponent);
  }
}
