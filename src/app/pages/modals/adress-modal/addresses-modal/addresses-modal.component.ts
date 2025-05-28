import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormArray,
  AbstractControl,
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
import { CustomCustomerAddress } from '../../../../data/interfaces/user-data.interfaces';
import { cityValidator } from '../../../../shared/validators';

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
  public addressEditForm!: FormGroup;

  public countries = [
    { value: 'US', viewValue: 'United States' },
    { value: 'IT', viewValue: 'Italy' },
    { value: 'ES', viewValue: 'Spain' },
  ];

  constructor(
    private fb: FormBuilder,
    private dialogReference: MatDialogRef<AddressesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { address: CustomCustomerAddress },
  ) {}

  public get addressesControls(): AbstractControl[] {
    const control = this.addressEditForm.get('addresses');
    if (control instanceof FormArray) {
      return control.controls;
    }
    return [];
  }
  public ngOnInit(): void {
    this.addressEditForm = this.createAddressGroup(this.data.address);
  }

  // public getFormControl(controlName: string): FormControl | null {
  //   const control = this.adressEditForm.get(controlName);
  //   return control instanceof FormControl ? control : null;
  // }

  public save(): void {
    if (this.addressEditForm.valid) {
      this.dialogReference.close(this.addressEditForm.value);
    }
  }

  public close(): void {
    this.dialogReference.close();
  }

  private createAddressGroup(address: CustomCustomerAddress): FormGroup {
    return this.fb.group({
      id: [address.id],
      streetName: [
        address.streetName,
        [Validators.pattern('(?=.*[A-Za-z0-9]).+'), Validators.required.bind(Validators)],
      ],
      postalCode: [
        address.postalCode,
        [Validators.pattern('^[0-9]{5}$'), Validators.required.bind(Validators)],
      ],
      city: [address.city, [cityValidator(), Validators.required.bind(Validators)]],
      country: [address.country, Validators.required.bind(Validators)],
      isShipping: [address.isShipping],
      isBilling: [address.isBilling],
      isDefaultShipping: [address.isDefaultShipping],
      isDefaultBilling: [address.isDefaultBilling],
    });
  }
}
