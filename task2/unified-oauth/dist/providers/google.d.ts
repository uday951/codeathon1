/**
 * Google OAuth provider implementation
 */
import { OAuthProvider, ProviderConfig, OAuthResponse, UserProfile } from '../types';
export declare class GoogleProvider implements OAuthProvider {
    private config;
    private readonly authUrl;
    private readonly tokenUrl;
    private readonly profileUrl;
    constructor(config: ProviderConfig);
    /**
     * Generate Google OAuth authorization URL
     */
    getAuthUrl(state?: string): string;
    /**
     * Exchange authorization code for access token
     */
    exchangeCodeForToken(code: string): Promise<OAuthResponse>;
    /**
     * Fetch user profile using access token
     */
    getUserProfile(accessToken: string): Promise<UserProfile>;
}
//# sourceMappingURL=google.d.ts.map