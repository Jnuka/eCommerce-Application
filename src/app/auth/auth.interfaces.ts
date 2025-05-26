export interface CustomerTokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  refresh_token: string;
  token_type: string;
}

export interface HttpErrorResponse {
  error: AuthErrorResponse;
}

export interface AuthErrorResponse {
  statusCode: number;
  message: string;
  errors: Errors[];
  error: string;
  error_description: string;
}

interface Errors {
  code: string;
  message: string;
}

export interface Customer {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth: string;
  password: string;
  addresses: Address[];
  defaultBillingAddressId?: string;
  shippingAddressIds: string;
  billingAddressIds: string;
  defaultShippingAddressId?: string;
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
}
