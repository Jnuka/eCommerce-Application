import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CartActionsService } from '../../cart/cart-actions.service';
import { LineItem } from '../../cart/cart-actions.interfaces';
import { CartItemComponent } from './cart-item/cart-item.component';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { ROUTES_PAGES } from '../../data/enums/routers';
import { UserDataService } from '../../data/services/user-data.service';

@Component({
  selector: 'app-cart',
  imports: [CartItemComponent, CurrencyPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  public static cartItems = signal<LineItem[]>([]);
  public static total = 0;
  public cartService = inject(CartActionsService);
  private userDataService = inject(UserDataService);
  private router = inject(Router);

  // eslint-disable-next-line class-methods-use-this
  public get totalPrice(): number {
    return CartComponent.total;
  }

  // eslint-disable-next-line class-methods-use-this
  public get cartItems(): WritableSignal<LineItem[]> {
    return CartComponent.cartItems;
  }

  public ngOnInit(): void {
    this.cartService.getCart().subscribe(response => {
      CartComponent.cartItems.set(response.lineItems);
      CartComponent.total = response.totalPrice.centAmount;
    });
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
}
