import { Component, inject } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Address, Customer, CustomerSignInResult } from '../../../auth/auth.interfaces';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { ProfileModalComponent } from '../../modals/profile-modal/profile-modal.component';
import { AddressesModalComponent } from '../../modals/adress-modal/addresses-modal/addresses-modal.component';

@Component({
  selector: 'app-user-profile',

  imports: [
    CommonModule,
    MatTabsModule,
    FormsModule,
    MatCheckboxModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent {
  public readonly authService = inject(AuthService);
  public customer = inject<AuthService>(AuthService).customerData;
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

  public isEditMode = false;
  public editableCustomer: Customer | null = null;
  public selectedTabIndex = 0;

  constructor(private dialog: MatDialog) {}

  public get currentCustomer(): CustomerSignInResult['customer'] | undefined {
    return this.customer()?.customer;
  }

  public get formattedDateOfBirth(): string {
    const dob = this.currentCustomer?.dateOfBirth;
    return dob ? new Date(dob).toLocaleDateString() : '';
  }

  public get shippingAddress(): Address {
    return this.currentCustomer?.addresses[0] ?? UserProfileComponent.emptyAddress();
  }

  public get billingAddress(): Address {
    return this.currentCustomer?.addresses[1] ?? UserProfileComponent.emptyAddress();
  }

  public get isDefaultShipping(): boolean {
    return this.currentCustomer?.defaultShippingAddressId === this.shippingAddress?.id;
  }

  public get isDefaultBilling(): boolean {
    return this.currentCustomer?.defaultBillingAddressId === this.billingAddress?.id;
  }

  private static emptyAddress(): Address {
    return { id: '', streetName: '', postalCode: '', city: '', country: '' };
  }
  public openModal(): void {
    switch (this.selectedTabIndex) {
      case 0: // Personal Information
        this.dialog
          .open(ProfileModalComponent, {
            data: this.currentCustomer,
            width: '600px',
          })
          .afterClosed()
          .subscribe((result: Customer | undefined) => {
            if (result) {
              this.savePersonalInfo(result);
            }
          });
        break;

      case 1: // Addresses
        this.dialog
          .open(AddressesModalComponent, {
            data: this.currentCustomer,
            width: '800px',
            maxWidth: 'unset',
          })
          .afterClosed()
          .subscribe(
            (result: { shippingAddress: Address; billingAddress: Address } | undefined) => {
              if (result) {
                this.saveAddresses(result);
              }
            },
          );
        break;

      default:
        break;
    }
  }

  public isDefaultShippingEdit(): boolean {
    return this.editableCustomer?.defaultShippingAddressId === this.shippingAddress?.id;
  }

  public isDefaultBillingEdit(): boolean {
    return this.editableCustomer?.defaultBillingAddressId === this.billingAddress?.id;
  }

  public setDefaultShipping(checked: boolean): void {
    if (!this.editableCustomer) return;
    this.editableCustomer.defaultShippingAddressId = checked ? this.shippingAddress?.id : undefined;
  }

  public setDefaultBilling(checked: boolean): void {
    if (!this.editableCustomer) return;
    this.editableCustomer.defaultBillingAddressId = checked ? this.billingAddress?.id : undefined;
  }

  public saveChanges(): void {
    // API method
    const currentCustomer = this.customer();
    if (currentCustomer && this.editableCustomer) {
      currentCustomer.customer = { ...this.editableCustomer };
      this.isEditMode = false;
    }
  }

  public cancelEdit(): void {
    this.isEditMode = false;
    this.editableCustomer = null;
  }

  public logout(): void {
    this.authService.logout();
  }
  // eslint-disable-next-line class-methods-use-this
  private savePersonalInfo(data: Customer): void {
    console.log('Saved personal info', data); // eslint-disable-line no-console
  }
  // eslint-disable-next-line class-methods-use-this
  private saveAddresses(data: { shippingAddress: Address; billingAddress: Address }): void {
    console.log('Saved addresses', data); // eslint-disable-line no-console
  }
}
