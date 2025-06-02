export interface UpdateAddresses {
  version: number;
  actions: ActionAddress[];
}

export interface ActionAddress {
  action:
    | 'addAddress'
    | 'changeAddress'
    | 'removeAddress'
    | 'setDefaultShippingAddress'
    | 'addShippingAddressId'
    | 'setDefaultBillingAddress'
    | 'addBillingAddressId'
    | 'removeBillingAddressId'
    | 'removeShippingAddressId';
  addressId?: string;
  address?: AddressUpate;
}

export interface AddressUpate {
  streetName: string;
  postalCode: string;
  city: string;
  country: string;
}

export interface UpdateAddressesrResult {
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
