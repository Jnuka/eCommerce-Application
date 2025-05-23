import { Injectable } from '@angular/core';
import Toastify from 'toastify-js';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly defaultOptions: Partial<Toastify.Options> = {
    duration: 3000,
    gravity: 'top',
    position: 'center',
    close: true,
    stopOnFocus: true,
  };

  public error(message: string): void {
    this.show(`❌ ${message}`, {
      style: { background: 'rgb(82, 65, 57)' },
    });
  }

  public success(message: string): void {
    this.show(`✅ ${message}`, {
      style: { background: '#6B3C21' },
    });
  }

  private show(message: string, options: Partial<Toastify.Options> = {}): void {
    Toastify({
      text: message,
      ...this.defaultOptions,
      ...options,
    }).showToast();
  }
}
