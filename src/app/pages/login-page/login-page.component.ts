import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { emailValidator, passwordValidator, spacesCheck } from '../../shared/validators';
import { ROUTES_PAGES } from '../../data/enums/routers';

@Component({
  selector: 'app-login-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    FormsModule,
  ],

  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
  public loginForm = new FormGroup({
    email: new FormControl('', [spacesCheck(), emailValidator()]),
    password: new FormControl('', [
      Validators.required.bind(Validators),
      spacesCheck(),
      passwordValidator(),
    ]),
  });

  public hidePassword = signal(true);

  private router = inject(Router);
  private authService = inject(AuthService);

  public clickEvent(event: MouseEvent): void {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  public goRegistration(): void {
    void this.router.navigate([ROUTES_PAGES.REGISTRATION]);
  }

  public goMain(): void {
    void this.router.navigate(['']);
  }

  public onSubmit = (): void => {
    if (this.loginForm.invalid) return;
    const customError = document.querySelector('.customer-error');
    if (customError instanceof HTMLElement && customError.classList.contains('show')) {
      customError.classList.remove('show');
    }
    const { email, password } = this.loginForm.value;
    if (!email || !password) return;
    this.authService.login({ email, password }).subscribe({
      next: () => {
        void this.goMain();
      },
      error: () => {
        console.log('Login incomplete'); // eslint-disable-line no-console
      },
    });
  };
}
