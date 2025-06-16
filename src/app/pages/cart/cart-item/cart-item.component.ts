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

@Component({
  selector: 'app-cart-item',
  imports: [MatInputModule, ReactiveFormsModule, CurrencyPipe],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.css',
})
export class CartItemComponent implements OnInit {
  public item = input.required<LineItem>();
  public quantityInput = new FormControl(1);
  private userDataService = inject(UserDataService);
  private cartService = inject(CartActionsService);
  private router = inject(Router);

  public ngOnInit(): void {
    this.quantityInput.setValue(this.item().quantity);
  }

  public changeQuantity(): void {
    const cart = this.userDataService.customerData()?.cart;
    const cartId = cart?.id;
    const version = cart?.version;
    const lineItemId = this.item().id;
    const quantity = this.quantityInput.value || 1;

    if (cartId && version != null) {
      this.cartService.changeQuantity(cartId, version, lineItemId, quantity).subscribe(response => {
        CartComponent.cartItems.set(response.lineItems);
        CartComponent.total = response.totalPrice.centAmount;
        this.userDataService.refreshCustomerData();
      });
    }
  }

  public removeFromCart(): void {
    const cart = this.userDataService.customerData()?.cart;
    const cartId = cart?.id;
    const version = cart?.version;
    const lineItemId = this.item().id;
    const quantity = this.quantityInput.value || 1;

    if (cartId && version != null) {
      this.cartService.removeFromCart(cartId, version, lineItemId, quantity).subscribe(response => {
        CartComponent.cartItems.set(response.lineItems);
        CartComponent.total = response.totalPrice.centAmount;
        this.userDataService.refreshCustomerData();
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
