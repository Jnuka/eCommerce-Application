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

  public error(message: string): void {
    this.show(`❌ ${message}`, { backgroundColor: '#f87171' });
  }

  public success(message: string): void {
    this.show(`✅ ${message}`, { backgroundColor: '#34d399' });
  }

  private show(message: string, options: Partial<Toastify.Options> = {}): void {
    Toastify({
      text: message,
      ...this.defaultOptions,
      ...options,
    }).showToast();
  }
}
