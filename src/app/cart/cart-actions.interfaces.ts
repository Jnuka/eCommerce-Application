
import { LocalizedString, ProductVariant } from '../products/products.interfaces';

// Create cart
export interface CartResponse {
  id: string;
  version: number;
  customerId?: string;
  anonymousId?: string;
  lineItems: LineItem[];
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
  variant: ProductVariant;
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
  action: 'addLineItem' | 'removeLineItem' | 'changeLineItemQuantity';
  productId?: string;
  variantId?: string;
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

export interface UpdateCartResponse {
  id: string;
  version: number;
  customerId?: string;
  anonymousId?: string;
  lineItems: LineItem[];
  totalLineItemQuantity: number;
}
