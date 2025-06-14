import { LocalizedString, ProductVariant } from '../products/products.interfaces';

// Create cart
export interface CartResponse {
  id: string;
  version: number;
  customerId?: string;
  anonymousId?: string;
  lineItems: LineItem[];
}

export interface LineItem {
  id: string;
  productId: string;
  name: LocalizedString;
  variant: ProductVariant;
  quantity: number;
}

export interface MyCartDraft {
  currency: string;
}

// Add to cart
export interface UpdateCart {
  version: number;
  actions: Action[];
}

export interface Action {
  action: 'addLineItem' | 'removeLineItem' | 'changeLineItemQuantity';
  productId?: string;
  variantId?: string;
  lineItemId?: string;
  quantity?: number;
}

export interface UpdateCartResponse {
  id: string;
  version: number;
  customerId?: string;
  anonymousId?: string;
  lineItems: LineItem[];
}
