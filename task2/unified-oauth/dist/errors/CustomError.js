"use strict";
/**
 * Custom error classes for OAuth operations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidProviderError = exports.ProfileFetchError = exports.TokenExchangeError = exports.OAuthError = void 0;
class OAuthError extends Error {
    constructor(message, code, statusCode) {
        super(message);
        this.name = 'OAuthError';
        this.code = code;
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.OAuthError = OAuthError;
class TokenExchangeError extends OAuthError {
    constructor(message, statusCode) {
        super(message, 'TOKEN_EXCHANGE_ERROR', statusCode);
        this.name = 'TokenExchangeError';
    }
}
exports.TokenExchangeError = TokenExchangeError;
class ProfileFetchError extends OAuthError {
    constructor(message, statusCode) {
        super(message, 'PROFILE_FETCH_ERROR', statusCode);
        this.name = 'ProfileFetchError';
    }
}
exports.ProfileFetchError = ProfileFetchError;
class InvalidProviderError extends OAuthError {
    constructor(provider) {
        super(`Unsupported provider: ${provider}`, 'INVALID_PROVIDER');
        this.name = 'InvalidProviderError';
    }
}
exports.InvalidProviderError = InvalidProviderError;
//# sourceMappingURL=CustomError.js.map