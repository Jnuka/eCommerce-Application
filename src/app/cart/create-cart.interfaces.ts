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
}

export interface MyCartDraft {
  currency: string;
}
