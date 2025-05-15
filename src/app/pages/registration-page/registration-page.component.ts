import { Component, inject } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgForOf, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { emailValidator } from '../../shared/validators';
import { ageValidator } from '../../shared/validators';

@Component({
  selector: 'app-registration-page',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCheckboxModule,
    NgForOf,
    CommonModule,
    ReactiveFormsModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './registration-page.component.html',
  styleUrl: './registration-page.component.css',
})
export class RegistrationPageComponent {
  public shippingCountry = [
    { value: 'opt-1', viewValue: 'Option 1' },
    { value: 'opt-2', viewValue: 'Option 2' },
    { value: 'opt-3', viewValue: 'Option 3' },
  ];
  public billingCountry = [
    { value: 'opt-1', viewValue: 'Option 1' },
    { value: 'opt-2', viewValue: 'Option 2' },
    { value: 'opt-3', viewValue: 'Option 3' },
  ];

  public regForm = new FormGroup({
    email: new FormControl('', emailValidator()),
    password: new FormControl('', [
      Validators.required.bind(Validators),
      Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$'),
    ]),
    firstName: new FormControl('', [
      Validators.required.bind(Validators),
      Validators.pattern('^[A-z]+$'),
    ]),
    lastName: new FormControl('', [
      Validators.required.bind(Validators),
      Validators.pattern('^[A-z]+$'),
    ]),
    userAge: new FormControl('', ageValidator()),
  });

  private router = inject(Router);
  public async goLogin(): Promise<void> {
    await this.router.navigate(['login']);
  }
}
