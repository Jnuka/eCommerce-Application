import { Attribute, Price, Image } from '../../products/products.interfaces';

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
  discountCodes?: DiscountCodeInfo[];
  totalPrice: {
    currencyCode: string;
    centAmount: number;
  };
}

export interface DiscountCodeInfo {
  discountCode: DiscountCodeReference;
  state:
    | 'NotActive'
    | 'NotValid'
    | 'DoesNotMatchCart'
    | 'MatchesCart'
    | 'MaxApplicationReached'
    | 'ApplicationStoppedByPreviousDiscount';
}

export interface DiscountCodeReference {
  id: string;
  typeId: 'discount-code';
}

interface LineItem {
  id: string;
  productId: string;
  name: string;
  variant: VariantItem;
}

export interface VariantItem {
  id: number;
  prices: Price[];
  images: Image[];
  attributes: Attribute[];
}
