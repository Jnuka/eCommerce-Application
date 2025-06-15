export interface Customer {
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

export interface CustomerSignInResult {
  customer: Customer;
  customAddresses?: CustomCustomerAddress[];
  cart?: Cart;
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
  isDefault?: boolean;
}

interface Cart {
  id: string;
  version: number;
  customerId?: string;
  anonymousId?: string;
  lineItems: LineItem[];
}

interface LineItem {
  id: string;
  productId: string;
  name: string;
  variant: VariantItem;
}

export interface VariantItem {
  id: number;
}
