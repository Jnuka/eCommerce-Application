import { Component, inject } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
  public form = new FormGroup({
    email: new FormControl('', [
      Validators.required.bind(Validators),
      Validators.email.bind(Validators),
    ]),
    password: new FormControl('', Validators.required.bind(Validators)),
  });

  private router = inject(Router);
  private authService = inject(AuthService);

  public async goRegistration(): Promise<void> {
    await this.router.navigate(['registration']);
  }

  public async goMain(): Promise<void> {
    await this.router.navigate(['']);
  }

  public onSubmit = (): void => {
    if (this.form.invalid) return;

    const { email, password } = this.form.value;
    if (!email || !password) return;
    this.authService.login({ email, password }).subscribe({
      next: () => {
        void this.goMain();
      },
      error: error => {
        console.error('Login error:', error); // eslint-disable-line no-console
      },
    });
  };
}
