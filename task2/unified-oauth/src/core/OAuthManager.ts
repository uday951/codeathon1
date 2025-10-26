/**
 * Central OAuth manager for handling multiple providers
 */

import { OAuthProvider, ProviderConfig, SupportedProvider, OAuthResponse, UserProfile } from '../types';
import { GoogleProvider } from '../providers/google';
import { GitHubProvider } from '../providers/github';
import { FacebookProvider } from '../providers/facebook';
import { TwitterProvider } from '../providers/twitter';
import { InstagramProvider } from '../providers/instagram';
import { LinkedInProvider } from '../providers/linkedin';
import { RedditProvider } from '../providers/reddit';
import { InvalidProviderError } from '../errors/CustomError';
import { logger } from '../utils/logger';

export class OAuthManager {
  private providers: Map<SupportedProvider, OAuthProvider> = new Map();

  /**
   * Initialize OAuth manager with provider configurations
   */
  constructor(configs: Partial<Record<SupportedProvider, ProviderConfig>>) {
    this.initializeProviders(configs);
  }

  /**
   * Initialize provider instances based on configurations
   */
  private initializeProviders(configs: Partial<Record<SupportedProvider, ProviderConfig>>): void {
    const providerClasses = {
      google: GoogleProvider,
      github: GitHubProvider,
      facebook: FacebookProvider,
      twitter: TwitterProvider,
      instagram: InstagramProvider,
      linkedin: LinkedInProvider,
      reddit: RedditProvider
    };

    Object.entries(configs).forEach(([provider, config]) => {
      if (config && providerClasses[provider as SupportedProvider]) {
        const ProviderClass = providerClasses[provider as SupportedProvider];
        this.providers.set(provider as SupportedProvider, new ProviderClass(config));
        logger.info(`Initialized ${provider} provider`);
      }
    });
  }

  /**
   * Get authorization URL for a specific provider
   */
  getAuthUrl(provider: SupportedProvider, state?: string): string {
    const providerInstance = this.getProvider(provider);
    return providerInstance.getAuthUrl(state);
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(provider: SupportedProvider, code: string): Promise<OAuthResponse> {
    const providerInstance = this.getProvider(provider);
    return await providerInstance.exchangeCodeForToken(code);
  }

  /**
   * Get user profile using access token
   */
  async getUserProfile(provider: SupportedProvider, accessToken: string): Promise<UserProfile> {
    const providerInstance = this.getProvider(provider);
    return await providerInstance.getUserProfile(accessToken);
  }

  /**
   * Complete OAuth flow: exchange code and get user profile
   */
  async completeOAuth(provider: SupportedProvider, code: string): Promise<{ token: OAuthResponse; profile: UserProfile }> {
    logger.info(`Completing OAuth flow for ${provider}`);
    
    const token = await this.exchangeCodeForToken(provider, code);
    const profile = await this.getUserProfile(provider, token.accessToken);
    
    logger.info(`OAuth flow completed successfully for ${provider}`);
    return { token, profile };
  }

  /**
   * Get provider instance
   */
  private getProvider(provider: SupportedProvider): OAuthProvider {
    const providerInstance = this.providers.get(provider);
    if (!providerInstance) {
      throw new InvalidProviderError(provider);
    }
    return providerInstance;
  }

  /**
   * Get list of configured providers
   */
  getConfiguredProviders(): SupportedProvider[] {
    return Array.from(this.providers.keys());
  }

  /**
   * Check if a provider is configured
   */
  isProviderConfigured(provider: SupportedProvider): boolean {
    return this.providers.has(provider);
  }
}