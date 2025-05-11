import { Component, inject } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
  private router = inject(Router);
  public async goRegistration(): Promise<void> {
    await this.router.navigate(['registration']);
  }
}
