import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CartActionsService } from '../../cart/cart-actions.service';
import { LineItem } from '../../cart/cart-actions.interfaces';
import { CartItemComponent } from './cart-item/cart-item.component';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { ROUTES_PAGES } from '../../data/enums/routers';

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
}
