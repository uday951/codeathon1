/**
 * Custom error classes for OAuth operations
 */
export declare class OAuthError extends Error {
    readonly code: string;
    readonly statusCode?: number;
    constructor(message: string, code: string, statusCode?: number);
}
export declare class TokenExchangeError extends OAuthError {
    constructor(message: string, statusCode?: number);
}
export declare class ProfileFetchError extends OAuthError {
    constructor(message: string, statusCode?: number);
}
export declare class InvalidProviderError extends OAuthError {
    constructor(provider: string);
}
//# sourceMappingURL=CustomError.d.ts.map