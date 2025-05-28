export interface UpdateCustomer {
  version: number;
  actions: Action[];
}

export interface Action {
  action: 'changeEmail' | 'setFirstName' | 'setLastName' | 'setDateOfBirth';
  email?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
}

export interface UpdateCustomerResult {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  password: string;
  addresses: Address[];
  defaultBillingAddressId?: string;
  shippingAddressIds: string[];
  billingAddressIds: string[];
  defaultShippingAddressId?: string;
  version: number;
}

export interface Address {
  id: string;
  streetName: string;
  postalCode: string;
  city: string;
  country: string;
}
