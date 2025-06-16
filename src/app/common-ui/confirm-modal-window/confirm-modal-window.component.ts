import { Component, inject } from '@angular/core';
import { MatDialogClose } from '@angular/material/dialog';
import { CartComponent } from '../../pages/cart/cart.component';

@Component({
  selector: 'app-confirm-modal-window',
  imports: [MatDialogClose],
  templateUrl: './confirm-modal-window.component.html',
  styleUrl: './confirm-modal-window.component.css',
})
export class ConfirmModalWindowComponent {
  public cartComponent = inject(CartComponent);
}
