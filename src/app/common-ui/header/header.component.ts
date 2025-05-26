import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  public customer = inject(AuthService).customerData;
  private router = inject(Router);
  private authService = inject(AuthService);

  public isAuthAcc(): boolean {
    return this.authService.isAuth;
  }

  public logout(): void {
    this.authService.logout();
  }

  public async goHome(): Promise<void> {
    await this.router.navigate(['']);
  }
  public async goLogin(): Promise<void> {
    await this.router.navigate(['login']);
  }
  public async goRegistration(): Promise<void> {
    await this.router.navigate(['registration']);
  }
  public async goAbout(): Promise<void> {
    await this.router.navigate(['about']);
  }
  public async goProfile(): Promise<void> {
    await this.router.navigate(['profile']);
  }
}
