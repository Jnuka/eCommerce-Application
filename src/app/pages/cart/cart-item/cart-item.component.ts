import { Component, inject, input, OnInit } from '@angular/core';
import { Action, LineItem } from '../../../cart/cart-actions.interfaces';
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
  private cartService = inject(CartActionsService);
  private router = inject(Router);

  public ngOnInit(): void {
    this.quantityInput.setValue(this.item().quantity);
  }

  public changeQuantity(): void {
    const lineItemId = this.item().id;
    const quantity = this.quantityInput.value || 1;

    const actions: Action[] = [
      {
        action: 'changeLineItemQuantity',
        lineItemId: `${lineItemId}`,
        quantity: quantity,
      },
    ];

    this.cartService.UpdateCart(actions).subscribe(response => {
      CartComponent.cartItems.set(response.lineItems);
      CartComponent.total = response.totalPrice.centAmount;
    });
  }

  public removeFromCart(): void {
    const lineItemId = this.item().id;
    const quantity = this.quantityInput.value || 1;

    const actions: Action[] = [
      {
        action: 'removeLineItem',
        lineItemId: `${lineItemId}`,
        quantity,
      },
    ];

    this.cartService.UpdateCart(actions).subscribe(response => {
      CartComponent.cartItems.set(response.lineItems);
      CartComponent.total = response.totalPrice.centAmount;
    });
  }

  public goProductById(): void {
    const productId = this.item().productId;
    void this.router.navigate([ROUTES_PAGES.PRODUCT], {
      queryParams: { productId: productId },
    });
  }
}
