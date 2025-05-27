import { Component, inject } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { Address, Customer, CustomerSignInResult } from '../../../auth/auth.interfaces';
import { MatDialog } from '@angular/material/dialog';
import { ProfileModalComponent } from '../../modals/profile-modal/profile-modal.component';
import { AddressesModalComponent } from '../../modals/adress-modal/addresses-modal/addresses-modal.component';
import { UpdateUserInfoService } from '../../../udate-services/udate-user-info/update-user-info.service';
import {
  Action,
  UpdateCustomer,
} from '../../../udate-services/udate-user-info/update-user-info.interfaces';

@Component({
  selector: 'app-user-profile',

  imports: [CommonModule, MatTabsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent {
  public readonly authService = inject(AuthService);
  public customer = this.authService.customerData;
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
  private updateService = inject(UpdateUserInfoService);

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
      case 0:
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

      case 1:
        this.dialog
          .open(AddressesModalComponent, {
            data: {
              ...this.currentCustomer,
              isDefaultShipping: this.isDefaultShipping,
              isDefaultBilling: this.isDefaultBilling,
            },
            width: '800px',
            maxWidth: 'unset',
          })
          .afterClosed()
          .subscribe(
            (result: {
              shippingAddress: Address & { setDefault: boolean };
              billingAddress: Address & { setDefault: boolean };
            }) => {
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

  private savePersonalInfo(data: Customer): void {
    const currentCustomer = this.currentCustomer;
    if (!currentCustomer) return;

    const actions: Action[] = [];

    if (data.email !== currentCustomer.email) {
      actions.push({ action: 'changeEmail', email: data.email });
    }
    if (data.firstName !== currentCustomer.firstName) {
      actions.push({ action: 'setFirstName', firstName: data.firstName });
    }
    if (data.lastName !== currentCustomer.lastName) {
      actions.push({ action: 'setLastName', lastName: data.lastName });
    }

    if (actions.length === 0) return;

    const updateCustomer: UpdateCustomer = {
      version: currentCustomer.version,
      actions,
    };

    this.updateService.update(currentCustomer.id, updateCustomer).subscribe({
      next: result => {
        this.customer.update(current => {
          if (!current) return current;
          return {
            ...current,
            customer: {
              ...current.customer,
              ...data,
              version: result.version,
            },
          };
        });
      },
      error: error => {
        console.error('Failed to update customer info', error); // eslint-disable-line no-console
      },
    });
  }

  private saveAddresses(data: {
    shippingAddress: Address & { setDefault: boolean };
    billingAddress: Address & { setDefault: boolean };
  }): void {
    this.customer.update(current => {
      if (!current) return current;

      const updatedShipping: Address = {
        ...data.shippingAddress,
        id: current.customer.addresses[0]?.id || '',
      };
      const updatedBilling: Address = {
        ...data.billingAddress,
        id: current.customer.addresses[1]?.id || '',
      };

      return {
        ...current,
        customer: {
          ...current.customer,
          addresses: [updatedShipping, updatedBilling],
          defaultShippingAddressId: data.shippingAddress.setDefault
            ? updatedShipping.id
            : undefined,
          defaultBillingAddressId: data.billingAddress.setDefault ? updatedBilling.id : undefined,
        },
      };
    });

    console.log('Saved addresses', data); // eslint-disable-line no-console
  }
}
