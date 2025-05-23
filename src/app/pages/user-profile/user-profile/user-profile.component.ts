import { Component, inject } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, MatTabsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent {
  public readonly authService = inject(AuthService);
  public customer = inject(AuthService).customerData;

  public logout(): void {
    this.authService.logout();
  }
}
