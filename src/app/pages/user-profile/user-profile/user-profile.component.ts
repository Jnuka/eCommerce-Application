import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { ProfileModalComponent } from '../../modals/profile-modal/profile-modal.component';
import { AddressesModalComponent } from '../../modals/adress-modal/addresses-modal/addresses-modal.component';
import { UpdateUserInfoService } from '../../../udate-services/udate-user-info/update-user-info.service';
import {
  Action,
  UpdateCustomer,
} from '../../../udate-services/udate-user-info/update-user-info.interfaces';
import { UpdateAddressesService } from '../../../udate-services/update-addresses/update-addresses.service';
import { ActionAddress } from '../../../udate-services/update-addresses/update-addresses.interfaces';
import { UserDataService } from '../../../data/services/user-data.service';
import {
  Customer,
  CustomerSignInResult,
  Address,
  CustomCustomerAddress,
} from '../../../data/interfaces/user-data.interfaces';

@Component({
  selector: 'app-user-profile',

  imports: [CommonModule, MatTabsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent {
  public readonly userDataService = inject(UserDataService);
  public customer = this.userDataService.customerData;

  public isEditMode = false;
  public editableCustomer: Customer | null = null;
  public selectedTabIndex = 0;
  private updateService = inject(UpdateUserInfoService);
  private updateAddressesService = inject(UpdateAddressesService);

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

  public get customAddresses(): CustomCustomerAddress[] {
    return this.customer()?.customAddresses ?? [];
  }

  private static emptyAddress(): Address {
    return { id: '', streetName: '', postalCode: '', city: '', country: '' };
  }
  public openModal(address?: CustomCustomerAddress): void {
    switch (this.selectedTabIndex) {
      case 0:
        this.dialog
          .open(ProfileModalComponent, {
            data: { ...this.currentCustomer },
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
              address: address ?? {
                id: '',
                streetName: '',
                postalCode: '',
                city: '',
                country: '',
                isShipping: false,
                isBilling: false,
                isDefaultShipping: false,
                isDefaultBilling: false,
              },
            },
            width: '600px',
            maxWidth: 'unset',
          })
          .afterClosed()
          .subscribe((result: CustomCustomerAddress | undefined) => {
            if (result) {
              this.saveCustomAddresses(result);
            }
          });
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

  private saveCustomAddresses(address: CustomCustomerAddress): void {
    const currentCustomer = this.currentCustomer;
    if (!currentCustomer) return;

    const isNew = !address.id;

    const actions: ActionAddress[] = [];

    if (isNew) {
      actions.push({
        action: 'addAddress',
        address: {
          streetName: address.streetName,
          postalCode: address.postalCode.toString(),
          city: address.city,
          country: address.country,
        },
      });
    } else {
      actions.push({
        action: 'changeAddress',
        addressId: address.id,
        address: {
          streetName: address.streetName,
          postalCode: address.postalCode,
          city: address.city,
          country: address.country,
        },
      });

      if (address.isShipping) {
        actions.push({
          action: 'addShippingAddressId',
          addressId: address.id,
        });
      }

      if (address.isBilling) {
        actions.push({
          action: 'addBillingAddressId',
          addressId: address.id,
        });
      }
    }

    const updateBody = {
      version: currentCustomer.version,
      actions,
    };

    this.updateAddressesService.update(currentCustomer.id, updateBody).subscribe({
      next: result => {
        this.customer.update(current => {
          if (!current) return current;

          let updatedAddresses;

          if (isNew) {
            const newAddress = {
              ...address,
              id: `new-${Date.now()}`,
            };
            updatedAddresses = [...current.customer.addresses, newAddress];

            const addressIndex = updatedAddresses.length - 1;
            const realAddress = current.customer.addresses[addressIndex];

            const followUpActions: ActionAddress[] = [];
            if (address.isShipping) {
              followUpActions.push({
                action: 'addShippingAddressId',
                addressId: realAddress.id,
              });
            }
            if (address.isBilling) {
              followUpActions.push({
                action: 'addBillingAddressId',
                addressId: realAddress.id,
              });
            }

            if (followUpActions.length) {
              const followUpBody = {
                version: result.version,
                actions: followUpActions,
              };
              this.updateAddressesService.update(current.customer.id, followUpBody).subscribe();
            }
          } else {
            updatedAddresses = current.customer.addresses.map(a =>
              a.id === address.id ? address : a,
            );
          }

          return {
            ...current,
            customer: {
              ...current.customer,
              addresses: updatedAddresses,
              version: result.version,
              defaultShippingAddressId: address.isDefaultShipping
                ? address.id
                : current.customer.defaultShippingAddressId,
              defaultBillingAddressId: address.isDefaultBilling
                ? address.id
                : current.customer.defaultBillingAddressId,
            },
          };
        });
      },
      error: error => {
        console.error('Failed to update address', error); // eslint-disable-line no-console
      },
    });
  }
}
