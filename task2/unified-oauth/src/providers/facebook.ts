/**
 * Facebook OAuth provider implementation
 */

import { OAuthProvider, ProviderConfig, OAuthResponse, UserProfile } from '../types';
import { HttpClient } from '../utils/httpClient';
import { TokenExchangeError, ProfileFetchError } from '../errors/CustomError';
import { logger } from '../utils/logger';

export class FacebookProvider implements OAuthProvider {
  private config: ProviderConfig;
  private readonly authUrl = 'https://www.facebook.com/v18.0/dialog/oauth';
  private readonly tokenUrl = 'https://graph.facebook.com/v18.0/oauth/access_token';
  private readonly profileUrl = 'https://graph.facebook.com/v18.0/me';

  constructor(config: ProviderConfig) {
    this.config = config;
  }

  /**
   * Generate Facebook OAuth authorization URL
   */
  getAuthUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: this.config.scopes?.join(',') || 'email,public_profile',
      ...(state && { state })
    });

    const url = `${this.authUrl}?${params.toString()}`;
    logger.info('Generated auth URL', 'facebook');
    return url;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<OAuthResponse> {
    try {
      logger.info('Exchanging code for token', 'facebook');
      
      const params = new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        code,
        redirect_uri: this.config.redirectUri
      });

      const response = await HttpClient.get<any>(`${this.tokenUrl}?${params.toString()}`, {}, 'facebook');

      return {
        accessToken: response.access_token,
        tokenType: response.token_type,
        expiresIn: response.expires_in
      };
    } catch (error) {
      throw new TokenExchangeError(`Failed to exchange code for token: ${error}`, 400);
    }
  }

  /**
   * Fetch user profile using access token
   */
  async getUserProfile(accessToken: string): Promise<UserProfile> {
    try {
      logger.info('Fetching user profile', 'facebook');
      
      const params = new URLSearchParams({
        fields: 'id,name,email,first_name,last_name,picture',
        access_token: accessToken
      });

      const response = await HttpClient.get<any>(`${this.profileUrl}?${params.toString()}`, {}, 'facebook');

      return {
        id: response.id,
        email: response.email,
        name: response.name,
        firstName: response.first_name,
        lastName: response.last_name,
        avatar: response.picture?.data?.url,
        provider: 'facebook',
        raw: response
      };
    } catch (error) {
      throw new ProfileFetchError(`Failed to fetch user profile: ${error}`, 400);
    }
  }
}