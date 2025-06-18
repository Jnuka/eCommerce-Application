import { DiscountCodeInfo, VariantItem } from '../data/interfaces/user-data.interfaces';
import { LocalizedString } from '../products/products.interfaces';

// Create cart
export interface CartResponse {
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
  totalLineItemQuantity: number;
}

export interface LineItem {
  id: string;
  productId: string;
  name: LocalizedString;
  variant: VariantItem;
  quantity: number;
  totalPrice: {
    currencyCode: string;
    centAmount: number;
  };
}

export interface MyCartDraft {
  currency: string;
  anonymousId?: string;
}

// Add to cart
export interface UpdateCart {
  version?: number;
  actions: Action[];
}

export interface Action {
  action:
    | 'addLineItem'
    | 'removeLineItem'
    | 'changeLineItemQuantity'
    | 'addDiscountCode'
    | 'removeDiscountCode';
  code?: string;
  discountCode?: DiscountCodeReference;
  productId?: string;
  variantId?: number;
  lineItemId?: string;
  quantity?: number;
  externalPrice?: {
    currencyCod: string;
    centAmount: number;
  };
  shippingDetailsToRemove?: {
    targets: [
      {
        addressKey: string;
        quantity: number;
      },
    ];
  };
}

export interface DiscountCodeReference {
  id: string;
  typeId: 'discount-code';
}

export interface DiscountCode {
  id: string;
  version: number;
  code: string;
  cartDiscounts: CartDiscountReference[];
  isActive: boolean;
}

interface CartDiscountReference {
  id: string;
  typeId: 'discount-code';
}
