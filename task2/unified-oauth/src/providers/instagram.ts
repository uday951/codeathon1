/**
 * Instagram OAuth provider implementation
 */

import { OAuthProvider, ProviderConfig, OAuthResponse, UserProfile } from '../types';
import { HttpClient } from '../utils/httpClient';
import { TokenExchangeError, ProfileFetchError } from '../errors/CustomError';
import { logger } from '../utils/logger';

export class InstagramProvider implements OAuthProvider {
  private config: ProviderConfig;
  private readonly authUrl = 'https://api.instagram.com/oauth/authorize';
  private readonly tokenUrl = 'https://api.instagram.com/oauth/access_token';
  private readonly profileUrl = 'https://graph.instagram.com/me';

  constructor(config: ProviderConfig) {
    this.config = config;
  }

  /**
   * Generate Instagram OAuth authorization URL
   */
  getAuthUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: this.config.scopes?.join(',') || 'user_profile,user_media',
      ...(state && { state })
    });

    const url = `${this.authUrl}?${params.toString()}`;
    logger.info('Generated auth URL', 'instagram');
    return url;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<OAuthResponse> {
    try {
      logger.info('Exchanging code for token', 'instagram');
      
      const data = new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: this.config.redirectUri
      });

      const response = await HttpClient.post<any>(this.tokenUrl, data, {
        'Content-Type': 'application/x-www-form-urlencoded'
      }, 'instagram');

      return {
        accessToken: response.access_token,
        tokenType: 'Bearer'
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
      logger.info('Fetching user profile', 'instagram');
      
      const params = new URLSearchParams({
        fields: 'id,username,account_type',
        access_token: accessToken
      });

      const response = await HttpClient.get<any>(`${this.profileUrl}?${params.toString()}`, {}, 'instagram');

      return {
        id: response.id,
        name: response.username,
        provider: 'instagram',
        raw: response
      };
    } catch (error) {
      throw new ProfileFetchError(`Failed to fetch user profile: ${error}`, 400);
    }
  }
}