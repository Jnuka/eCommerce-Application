import { Component, inject, OnInit, signal } from '@angular/core';
import { CartActionsService } from '../../cart/cart-actions.service';
import { LineItem } from '../../cart/cart-actions.interfaces';
import { CartItemComponent } from './cart-item/cart-item.component';

@Component({
  selector: 'app-cart',
  imports: [CartItemComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  public cartService = inject(CartActionsService);
  public cartItems = signal<LineItem[]>([]);

  public ngOnInit(): void {
    this.cartService.getCart().subscribe(response => {
      this.cartItems.set(response.lineItems);
    });
  }
}
