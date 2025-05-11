import { Component } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-login-page',
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class LoginPageComponent {}
