/**
 * Core types and interfaces for the unified-oauth package
 */
export interface ProviderConfig {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    scopes?: string[];
}
export interface UserProfile {
    id: string;
    email?: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    provider: string;
    raw?: any;
}
export interface OAuthResponse {
    accessToken: string;
    refreshToken?: string;
    expiresIn?: number;
    tokenType?: string;
    scope?: string;
}
export interface LoggerOptions {
    level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
    timestamp: boolean;
}
export interface OAuthProvider {
    getAuthUrl(state?: string): string;
    exchangeCodeForToken(code: string): Promise<OAuthResponse>;
    getUserProfile(accessToken: string): Promise<UserProfile>;
}
export type SupportedProvider = 'google' | 'github' | 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'reddit';
//# sourceMappingURL=types.d.ts.map