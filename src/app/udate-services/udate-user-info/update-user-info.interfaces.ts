export interface UpdateCustomer {
  version: number;
  actions: Action[];
}

export interface Action {
  action: 'changeEmail' | 'setFirstName' | 'setLastName' | 'setDateOfBirth';
  email?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
}

export interface UpdateCustomerResult {
  version: number;
  actions: string;
}
