export interface CustomerDraft {
  email: string;
  password: string;
  firstName?: string | null;
  lastName?: string | null;
  middleName?: string;
  title?: string;
  anonymousCart?: CartResourceIdentifier;
  anonymousId?: string;
  dateOfBirth: string; // ISO date: 'YYYY-MM-DD'
  vatId?: string;
  addresses?: BaseAddress[];
  defaultShippingAddress?: number;
  shippingAddresses?: number[];
  defaultBillingAddress?: number;
  billingAddresses?: number[];

  isEmailVerified?: boolean;
  salutation?: string;
  authenticationMode?: 'Password' | 'ExternalAuth'; // default: 'Password'
}

export interface BaseAddress {
  country?: string; // ISO 3166 alpha-2, e.g. 'DE', 'US'
  streetName?: string;
  postalCode?: string;
  city?: string;
}

export interface CartResourceIdentifier {
  id?: string;
  key?: string;
  typeId: 'cart';
}

export interface RegistrationErrorResponse {
  statusCode: number;
  message: string;
  errors: Errors[];
  error: string;
  error_description: string;
}

export interface HttpErrorResponse {
  error: RegistrationErrorResponse;
}

interface Errors {
  code: string;
  message: string;
}
