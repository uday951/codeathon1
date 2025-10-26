/**
 * Custom error classes for OAuth operations
 */

export class OAuthError extends Error {
  public readonly code: string;
  public readonly statusCode?: number;

  constructor(message: string, code: string, statusCode?: number) {
    super(message);
    this.name = 'OAuthError';
    this.code = code;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class TokenExchangeError extends OAuthError {
  constructor(message: string, statusCode?: number) {
    super(message, 'TOKEN_EXCHANGE_ERROR', statusCode);
    this.name = 'TokenExchangeError';
  }
}

export class ProfileFetchError extends OAuthError {
  constructor(message: string, statusCode?: number) {
    super(message, 'PROFILE_FETCH_ERROR', statusCode);
    this.name = 'ProfileFetchError';
  }
}

export class InvalidProviderError extends OAuthError {
  constructor(provider: string) {
    super(`Unsupported provider: ${provider}`, 'INVALID_PROVIDER');
    this.name = 'InvalidProviderError';
  }
}