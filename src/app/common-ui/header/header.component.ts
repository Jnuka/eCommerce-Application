import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [NgOptimizedImage],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private router = inject(Router);

  public async goHome(): Promise<void> {
    await this.router.navigate(['']);
  }
  public async goLogin(): Promise<void> {
    await this.router.navigate(['login']);
  }
  public async goRegistration(): Promise<void> {
    await this.router.navigate(['registration']);
  }
}
