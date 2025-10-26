/**
 * Central OAuth manager for handling multiple providers
 */
import { ProviderConfig, SupportedProvider, OAuthResponse, UserProfile } from '../types';
export declare class OAuthManager {
    private providers;
    /**
     * Initialize OAuth manager with provider configurations
     */
    constructor(configs: Partial<Record<SupportedProvider, ProviderConfig>>);
    /**
     * Initialize provider instances based on configurations
     */
    private initializeProviders;
    /**
     * Get authorization URL for a specific provider
     */
    getAuthUrl(provider: SupportedProvider, state?: string): string;
    /**
     * Exchange authorization code for access token
     */
    exchangeCodeForToken(provider: SupportedProvider, code: string): Promise<OAuthResponse>;
    /**
     * Get user profile using access token
     */
    getUserProfile(provider: SupportedProvider, accessToken: string): Promise<UserProfile>;
    /**
     * Complete OAuth flow: exchange code and get user profile
     */
    completeOAuth(provider: SupportedProvider, code: string): Promise<{
        token: OAuthResponse;
        profile: UserProfile;
    }>;
    /**
     * Get provider instance
     */
    private getProvider;
    /**
     * Get list of configured providers
     */
    getConfiguredProviders(): SupportedProvider[];
    /**
     * Check if a provider is configured
     */
    isProviderConfigured(provider: SupportedProvider): boolean;
}
//# sourceMappingURL=OAuthManager.d.ts.map