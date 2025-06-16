import { Component, inject, input, OnInit } from '@angular/core';
import { LineItem } from '../../../cart/cart-actions.interfaces';
import { UserDataService } from '../../../data/services/user-data.service';
import { CartActionsService } from '../../../cart/cart-actions.service';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CartComponent } from '../cart.component';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { ROUTES_PAGES } from '../../../data/enums/routers';
import { AuthService } from '../../../auth/auth.service';
import { HeaderComponent } from '../../../common-ui/header/header.component';

@Component({
  selector: 'app-cart-item',
  imports: [MatInputModule, ReactiveFormsModule, CurrencyPipe],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.css',
})
export class CartItemComponent implements OnInit {
  public item = input.required<LineItem>();
  public quantityInput = new FormControl(1);
  public cartId = '';
  public cartVersion = 1;
  private userDataService = inject(UserDataService);
  private cartService = inject(CartActionsService);
  private router = inject(Router);
  private authService = inject(AuthService);

  public ngOnInit(): void {
    this.quantityInput.setValue(this.item().quantity);
  }

  public changeQuantity(): void {
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
    const lineItemId = this.item().id;
    const quantity = this.quantityInput.value || 1;

    if (this.cartId && this.cartVersion != null) {
      this.cartService
        .changeQuantity(this.cartId, this.cartVersion, lineItemId, quantity)
        .subscribe(response => {
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

  public removeFromCart(): void {
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
    const lineItemId = this.item().id;
    const quantity = this.quantityInput.value || 1;

    if (this.cartId && this.cartVersion != null) {
      this.cartService
        .removeFromCart(this.cartId, this.cartVersion, lineItemId, quantity)
        .subscribe(response => {
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

  public goProductById(): void {
    const productId = this.item().productId;
    void this.router.navigate([ROUTES_PAGES.PRODUCT], {
      queryParams: { productId: productId },
    });
  }
}
