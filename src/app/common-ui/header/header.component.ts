import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { UserDataService } from '../../data/services/user-data.service';
import { ROUTES_PAGES } from '../../data/enums/routers';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  public static quantityIndicator = 0;
  public customer = inject(UserDataService).customerData;
  public router = inject(Router);
  private authService = inject(AuthService);

  // eslint-disable-next-line class-methods-use-this
  public get quantityIndicator(): number {
    return HeaderComponent.quantityIndicator;
  }

  public isAuthAcc(): boolean {
    return this.authService.isAuth;
  }

  public logout(): void {
    this.authService.logout();
  }

  public goHome(): void {
    void this.router.navigate(['']);
  }

  public goLogin(): void {
    void this.router.navigate([ROUTES_PAGES.LOGIN]);
  }

  public goRegistration(): void {
    void this.router.navigate([ROUTES_PAGES.REGISTRATION]);
  }

  public goAbout(): void {
    void this.router.navigate([ROUTES_PAGES.ABOUT]);
  }

  public goProfile(): void {
    void this.router.navigate([ROUTES_PAGES.PROFILE]);
  }

  public goCatalog(): void {
    void this.router.navigate([ROUTES_PAGES.CATALOG]);
  }

  public goCart(): void {
    void this.router.navigate([ROUTES_PAGES.CART]);
  }
}
