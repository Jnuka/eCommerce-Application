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
    | 'addBillingAddressId';
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
  version: number;
  actions: string;
}
