import { VariantItem } from '../data/interfaces/user-data.interfaces';

// Create cart
export interface CartResponse {
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

export interface MyCartDraft {
  currency: string;
  anonymousId?: string;
}

// Add to cart
export interface UpdateCart {
  version: number;
  actions: Action[];
}

export interface Action {
  action: 'addLineItem' | 'removeLineItem';
  productId?: string;
  variantId?: string;
  quantity?: number;
}

export interface UpdateCartResponse {
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
}
