import { Injectable } from '@angular/core';
import Toastify from 'toastify-js';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly defaultOptions: Partial<Toastify.Options> = {
    duration: 3000,
    gravity: 'top',
    position: 'right',
    close: true,
    stopOnFocus: true,
  };

  public show(message: string, options: Partial<Toastify.Options> = {}): void {
    Toastify({
      text: message,
      ...this.defaultOptions,
      ...options,
    }).showToast();
  }
}
