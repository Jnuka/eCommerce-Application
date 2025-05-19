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
import {
  emailValidator,
  passwordValidator,
  ageValidator,
  cityValidator,
  spacesCheck,
  isEmailExist,
} from '../../shared/validators';
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
  public shippingCountry = [
    { value: 'US', viewValue: 'United States' },
    { value: 'IT', viewValue: 'Italy' },
    { value: 'ES', viewValue: 'Spain' },
  ];
  public billingCountry = [
    { value: 'US', viewValue: 'United States' },
    { value: 'IT', viewValue: 'Italy' },
    { value: 'ES', viewValue: 'Spain' },
  ];

  public regForm = new FormGroup({
    email: new FormControl('', [
      Validators.required.bind(Validators),
      spacesCheck(),
      emailValidator(),
      isEmailExist(),
    ]),
    password: new FormControl('', [
      Validators.required.bind(Validators),
      spacesCheck(),
      passwordValidator(),
    ]),
    firstName: new FormControl('', [Validators.pattern('^[A-z]+$')]),
    lastName: new FormControl('', [Validators.pattern('^[A-z]+$')]),
    userAge: new FormControl('', [Validators.required.bind(Validators), ageValidator()]),

    shippingStreet: new FormControl('', Validators.pattern('(?=.*[A-Za-z0-9]).+')),
    shippingCity: new FormControl('', cityValidator()),
    shippingPostalCode: new FormControl('', Validators.pattern('[0-9]{5}')),
    shippingCountry: new FormControl('', Validators.required.bind(Validators)),
    setDefaultShipping: new FormControl(''),

    billingStreet: new FormControl('', Validators.pattern('(?=.*[A-z0-9]).+')),
    billingCity: new FormControl('', cityValidator()),
    billingPostalCode: new FormControl('', Validators.pattern('[0-9]{5}')),
    billingCountry: new FormControl(''),
    setDefaultBilling: new FormControl(''),

    sameAddress: new FormControl(''),
  });

  private router = inject(Router);
  private registrationService = inject(RegistrationService);
  private toastService = inject(ToastService);
  private arrayInputsValue = ['Street', 'City', 'PostalCode', 'Country'];

  public getFormControl(controlName: string): FormControl | null {
    const control = this.regForm.get(controlName);
    return control instanceof FormControl ? control : null;
  }

  public toggleValidation(): void {
    const shouldDisable = this.regForm.get('sameAddress')?.value;
    if (shouldDisable) {
      this.arrayInputsValue.forEach(value => {
        this.regForm.get(`billing${value}`)?.disable();
      });
    } else {
      this.arrayInputsValue.forEach(value => {
        this.regForm.get(`billing${value}`)?.enable();
      });
    }
    this.arrayInputsValue.forEach(value => {
      this.regForm.get(`billing${value}`)?.updateValueAndValidity();
    });
  }

  public async goLogin(): Promise<void> {
    await this.router.navigate(['login']);
  }

  public async goMain(): Promise<void> {
    await this.router.navigate(['']);
  }

  public onSubmit = (): void => {
    const shouldDisable = this.regForm.get('sameAddress')?.value;
    if (shouldDisable) {
      this.arrayInputsValue.forEach(value => {
        const pathValue = `billing${value}`;
        this.regForm.get(pathValue)?.setValue(this.regForm.get(`shipping${value}`)?.value || '');
      });
    }

    if (this.regForm.invalid) {
      this.toastService.error('Invalid form values');
      return;
    }

    this.arrayInputsValue.forEach(value => {
      this.regForm.get(`billing${value}`)?.enable();
    });

    const formData = this.regForm.value;

    if (
      !formData.email ||
      !formData.password ||
      !formData.userAge ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.shippingStreet ||
      !formData.shippingCity ||
      !formData.shippingPostalCode ||
      !formData.shippingCountry ||
      !formData.billingStreet ||
      !formData.billingCity ||
      !formData.billingPostalCode ||
      !formData.billingCountry
    ) {
      this.toastService.error('Missing required form values');
      return;
    }
    const isoDate = new Date(formData.userAge).toISOString().split('T')[0];

    const shippingAddress = {
      country: formData.shippingCountry ?? undefined,
      streetName: formData.shippingStreet ?? undefined,
      city: formData.shippingCity ?? undefined,
      postalCode: formData.shippingPostalCode.toString() ?? undefined,
    };

    const billingAddress = {
      country: formData.billingCountry ?? undefined,
      streetName: formData.billingStreet ?? undefined,
      city: formData.billingCity ?? undefined,
      postalCode: formData.billingPostalCode.toString() ?? undefined,
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
