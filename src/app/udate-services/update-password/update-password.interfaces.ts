export interface CustomerChangePassword {
  id: string;
  version: number;
  currentPassword: string;
  newPassword: string;
}

export interface UpdatePasswordResult {
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

export interface HttpErrorResponse {
  error: CangePasswordErrorResponse;
}

export interface CangePasswordErrorResponse {
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
