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
