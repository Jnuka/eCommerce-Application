import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Address, Customer } from '../../../../data/interfaces/user-data.interfaces';
import { cityValidator } from '../../../../shared/validators';
import { ProfileModalComponent } from '../../profile-modal/profile-modal.component';

@Component({
  selector: 'app-addresses-modal',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './addresses-modal.component.html',
  styleUrl: './addresses-modal.component.css',
})
export class AddressesModalComponent implements OnInit {
  public adressEditForm!: FormGroup;

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

  constructor(
    private fb: FormBuilder,
    private dialogReference: MatDialogRef<ProfileModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Customer,
  ) {}

  public ngOnInit(): void {
    const shipping = this.data?.addresses[0];
    const billing = this.data?.addresses[1];

    this.adressEditForm = this.fb.group({
      shippingAddress: this.createAddressGroup(
        shipping,
        this.data?.defaultShippingAddressId === shipping?.id,
      ),
      billingAddress: this.createAddressGroup(
        billing,
        this.data?.defaultBillingAddressId === billing?.id,
      ),
    });
  }

  public getFormControl(controlName: string): FormControl | null {
    const control = this.adressEditForm.get(controlName);
    return control instanceof FormControl ? control : null;
  }

  public save(): void {
    if (this.adressEditForm.valid) {
      const data = this.adressEditForm.value;
      // TODO: API method
      this.dialogReference.close(data);
    }
  }

  public close(): void {
    this.dialogReference.close();
  }

  private createAddressGroup(address: Address, isDefault: boolean): FormGroup {
    return this.fb.group({
      streetName: [address.streetName, Validators.pattern('(?=.*[A-Za-z0-9]).+')],
      postalCode: [address.postalCode, Validators.pattern('[0-9]{5}')],
      city: [address.city, cityValidator()],
      country: [address.country, Validators.required.bind(Validators)],
      setDefault: [isDefault],
    });
  }
}
