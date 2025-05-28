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
import {
  ActionAddress,
  UpdateAddresses,
} from '../../../udate-services/update-addresses/update-addresses.interfaces';
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

  public deleteAddress(addressId: string): void {
    const currentCustomer = this.currentCustomer;
    if (!currentCustomer) return;

    const actions: ActionAddress[] = [];

    if (currentCustomer.shippingAddressIds.includes(addressId)) {
      actions.push({
        action: 'removeShippingAddressId',
        addressId,
      });
    }

    if (currentCustomer.billingAddressIds.includes(addressId)) {
      actions.push({
        action: 'removeBillingAddressId',
        addressId,
      });
    }

    actions.push({
      action: 'removeAddress',
      addressId,
    });

    const updateBody: UpdateAddresses = {
      version: currentCustomer.version,
      actions,
    };

    this.updateAddressesService.update(currentCustomer.id, updateBody).subscribe({
      next: result => {
        this.customer.update(current => {
          if (!current) return current;

          const updatedAddresses = current.customer.addresses.filter(addr => addr.id !== addressId);

          return {
            ...current,
            customer: {
              ...current.customer,
              addresses: updatedAddresses,
              version: result.version,
              defaultShippingAddressId:
                current.customer.defaultShippingAddressId === addressId
                  ? ''
                  : current.customer.defaultShippingAddressId,
              defaultBillingAddressId:
                current.customer.defaultBillingAddressId === addressId
                  ? ''
                  : current.customer.defaultBillingAddressId,
              shippingAddressIds: current.customer.shippingAddressIds.filter(
                id => id !== addressId,
              ),
              billingAddressIds: current.customer.billingAddressIds.filter(id => id !== addressId),
            },
          };
        });
      },
      error: error => {
        console.error('Failed to delete address', error); // eslint-disable-line no-console
      },
    });
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
    const initialActions: ActionAddress[] = [];

    if (isNew) {
      initialActions.push({
        action: 'addAddress',
        address: {
          streetName: address.streetName,
          postalCode: address.postalCode.toString(),
          city: address.city,
          country: address.country,
        },
      });
    } else {
      initialActions.push({
        action: 'changeAddress',
        addressId: address.id,
        address: {
          streetName: address.streetName,
          postalCode: address.postalCode,
          city: address.city,
          country: address.country,
        },
      });

      const wasShipping = currentCustomer.shippingAddressIds.includes(address.id);
      const wasBilling = currentCustomer.billingAddressIds.includes(address.id);

      if (address.isShipping !== wasShipping) {
        initialActions.push({
          action: address.isShipping ? 'addShippingAddressId' : 'removeShippingAddressId',
          addressId: address.id,
        });
      }

      if (address.isBilling !== wasBilling) {
        initialActions.push({
          action: address.isBilling ? 'addBillingAddressId' : 'removeBillingAddressId',
          addressId: address.id,
        });
      }

      if (address.isDefaultShipping && currentCustomer.defaultShippingAddressId !== address.id) {
        initialActions.push({
          action: 'setDefaultShippingAddress',
          addressId: address.id,
        });
      }

      if (address.isDefaultBilling && currentCustomer.defaultBillingAddressId !== address.id) {
        initialActions.push({
          action: 'setDefaultBillingAddress',
          addressId: address.id,
        });
      }
    }

    const updateBody: UpdateAddresses = {
      version: currentCustomer.version,
      actions: initialActions,
    };

    this.updateAddressesService.update(currentCustomer.id, updateBody).subscribe({
      next: result => {
        this.customer.update(current => {
          if (!current) return current;

          const updatedAddresses = result.addresses;

          if (isNew) {
            const addedAddress = updatedAddresses.find(
              a =>
                a.streetName === address.streetName &&
                a.postalCode === address.postalCode.toString() &&
                a.city === address.city &&
                a.country === address.country,
            );

            if (!addedAddress) return current;

            const followUpActions: ActionAddress[] = [];

            if (address.isShipping) {
              followUpActions.push({
                action: 'addShippingAddressId',
                addressId: addedAddress.id,
              });
            }

            if (address.isBilling) {
              followUpActions.push({
                action: 'addBillingAddressId',
                addressId: addedAddress.id,
              });
            }

            if (address.isDefaultShipping) {
              followUpActions.push({
                action: 'setDefaultShippingAddress',
                addressId: addedAddress.id,
              });
            }

            if (address.isDefaultBilling) {
              followUpActions.push({
                action: 'setDefaultBillingAddress',
                addressId: addedAddress.id,
              });
            }

            if (followUpActions.length > 0) {
              const followUpBody: UpdateAddresses = {
                version: result.version,
                actions: followUpActions,
              };

              this.updateAddressesService.update(current.customer.id, followUpBody).subscribe();
            }
          }

          return {
            ...current,
            customer: {
              ...current.customer,
              addresses: updatedAddresses,
              version: result.version,
              defaultShippingAddressId: address.isDefaultShipping
                ? isNew
                  ? (updatedAddresses.find(
                      a =>
                        a.streetName === address.streetName &&
                        a.city === address.city &&
                        a.postalCode === address.postalCode.toString() &&
                        a.country === address.country,
                    )?.id ?? current.customer.defaultShippingAddressId)
                  : address.id
                : current.customer.defaultShippingAddressId,
              defaultBillingAddressId: address.isDefaultBilling
                ? isNew
                  ? (updatedAddresses.find(
                      a =>
                        a.streetName === address.streetName &&
                        a.city === address.city &&
                        a.postalCode === address.postalCode.toString() &&
                        a.country === address.country,
                    )?.id ?? current.customer.defaultBillingAddressId)
                  : address.id
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
