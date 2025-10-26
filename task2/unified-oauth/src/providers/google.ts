/**
 * Google OAuth provider implementation
 */

import { OAuthProvider, ProviderConfig, OAuthResponse, UserProfile } from '../types';
import { HttpClient } from '../utils/httpClient';
import { TokenExchangeError, ProfileFetchError } from '../errors/CustomError';
import { logger } from '../utils/logger';

export class GoogleProvider implements OAuthProvider {
  private config: ProviderConfig;
  private readonly authUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  private readonly tokenUrl = 'https://oauth2.googleapis.com/token';
  private readonly profileUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';

  constructor(config: ProviderConfig) {
    this.config = config;
  }

  /**
   * Generate Google OAuth authorization URL
   */
  getAuthUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: this.config.scopes?.join(' ') || 'openid email profile',
      access_type: 'offline',
      ...(state && { state })
    });

    const url = `${this.authUrl}?${params.toString()}`;
    logger.info('Generated auth URL', 'google');
    return url;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<OAuthResponse> {
    try {
      logger.info('Exchanging code for token', 'google');
      
      const data = {
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: this.config.redirectUri
      };

      const response = await HttpClient.post<any>(this.tokenUrl, data, {
        'Content-Type': 'application/x-www-form-urlencoded'
      }, 'google');

      return {
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
        expiresIn: response.expires_in,
        tokenType: response.token_type,
        scope: response.scope
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
      logger.info('Fetching user profile', 'google');
      
      const response = await HttpClient.get<any>(
        this.profileUrl,
        { Authorization: `Bearer ${accessToken}` },
        'google'
      );

      return {
        id: response.id,
        email: response.email,
        name: response.name,
        firstName: response.given_name,
        lastName: response.family_name,
        avatar: response.picture,
        provider: 'google',
        raw: response
      };
    } catch (error) {
      throw new ProfileFetchError(`Failed to fetch user profile: ${error}`, 400);
    }
  }
}