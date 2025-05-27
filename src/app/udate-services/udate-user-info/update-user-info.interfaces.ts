export interface UpdateCustomer {
  version: number;
  actions: Action[];
}

export interface Action {
  action: string;
  value: string;
}

export interface UpdateCustomerResult {
  version: number;
  actions: string;
}
