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
