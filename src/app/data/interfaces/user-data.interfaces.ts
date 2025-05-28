export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  password: string;
  addresses: Address[];
  defaultBillingAddressId?: string;
  shippingAddressIds: string;
  billingAddressIds: string;
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

export interface CustomerSignInResult {
  customer: Customer;
  customAddresses?: CustomCustomerAddress[];
}

export interface CustomCustomerAddress {
  id: string;
  streetName: string;
  postalCode: string;
  city: string;
  country: string;
  isShipping: boolean;
  isBilling: boolean;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
}
