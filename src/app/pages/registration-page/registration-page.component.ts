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
import { RegistrationService } from '../../registration/registration.service';
import { CustomerDraft } from '../../registration/registration.interfaces';
import { ToastService } from '../../helpers/toast.service';

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
  public form = new FormGroup({
    email: new FormControl('', [
      Validators.required.bind(Validators),
      Validators.email.bind(Validators),
    ]),
    password: new FormControl('', Validators.required.bind(Validators)),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    dateOfBirth: new FormControl('', Validators.required.bind(Validators)),

    shippingStreet: new FormControl(''),
    shippingCity: new FormControl(''),
    shippingPostalCode: new FormControl(''),
    shippingCountry: new FormControl('UNDEFINED'),
    setDefaultShipping: new FormControl(''),

    billingStreet: new FormControl(''),
    billingCity: new FormControl(''),
    billingPostalCode: new FormControl(''),
    billingCountry: new FormControl('UNDEFINED'),
    setDefaultBilling: new FormControl(''),
  });

  public shippingCountry = [
    { value: 'US', viewValue: 'United States' },
    { value: 'GB', viewValue: 'Great Britain' },
    { value: 'ES', viewValue: 'Spain' },
  ];
  public billingCountry = [
    { value: 'US', viewValue: 'United States' },
    { value: 'GB', viewValue: 'Great Britain' },
    { value: 'ES', viewValue: 'Spain' },
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
  private registrationService = inject(RegistrationService);
  private toastService = inject(ToastService);

  public async goLogin(): Promise<void> {
    await this.router.navigate(['login']);
  }

  public async goMain(): Promise<void> {
    await this.router.navigate(['']);
  }

  public onSubmit = (): void => {
    if (this.form.invalid) {
      this.toastService.error('Invalid form values');
      return;
    }
    const formData = this.form.value;
    if (!formData.email || !formData.password || !formData.dateOfBirth) {
      this.toastService.error('Missing required form values');
      return;
    }
    const isoDate = new Date(formData.dateOfBirth).toISOString().split('T')[0];

    const shippingAddress = {
      country: formData.shippingCountry ?? undefined,
      streetName: formData.shippingStreet ?? undefined,
      city: formData.shippingCity ?? undefined,
      postalCode: formData.shippingPostalCode ?? undefined,
    };

    const billingAddress = {
      country: formData.billingCountry ?? undefined,
      streetName: formData.billingStreet ?? undefined,
      city: formData.billingCity ?? undefined,
      postalCode: formData.billingPostalCode ?? undefined,
    };

    const customerDraft: CustomerDraft = {
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      dateOfBirth: isoDate,
      authenticationMode: 'Password',
      isEmailVerified: false,
      addresses: [shippingAddress, billingAddress],
      defaultShippingAddress: formData.setDefaultShipping ? 0 : undefined,
      shippingAddresses: [0],
      defaultBillingAddress: formData.setDefaultBilling ? 1 : undefined,
      billingAddresses: [1],
    };

    this.registrationService.signUp(customerDraft).subscribe({
      next: () => void this.goMain(),
      error: error => console.error('Registration error:', error), // eslint-disable-line no-console
    });
  };
}
