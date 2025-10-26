/**
 * Reddit OAuth provider implementation
 */

import { OAuthProvider, ProviderConfig, OAuthResponse, UserProfile } from '../types';
import { HttpClient } from '../utils/httpClient';
import { TokenExchangeError, ProfileFetchError } from '../errors/CustomError';
import { logger } from '../utils/logger';

export class RedditProvider implements OAuthProvider {
  private config: ProviderConfig;
  private readonly authUrl = 'https://www.reddit.com/api/v1/authorize';
  private readonly tokenUrl = 'https://www.reddit.com/api/v1/access_token';
  private readonly profileUrl = 'https://oauth.reddit.com/api/v1/me';

  constructor(config: ProviderConfig) {
    this.config = config;
  }

  /**
   * Generate Reddit OAuth authorization URL
   */
  getAuthUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: this.config.scopes?.join(' ') || 'identity',
      duration: 'temporary',
      ...(state && { state })
    });

    const url = `${this.authUrl}?${params.toString()}`;
    logger.info('Generated auth URL', 'reddit');
    return url;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<OAuthResponse> {
    try {
      logger.info('Exchanging code for token', 'reddit');
      
      const data = new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        redirect_uri: this.config.redirectUri
      });

      const credentials = Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64');

      const response = await HttpClient.post<any>(this.tokenUrl, data, {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'unified-oauth/1.0'
      }, 'reddit');

      return {
        accessToken: response.access_token,
        tokenType: response.token_type,
        expiresIn: response.expires_in,
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
      logger.info('Fetching user profile', 'reddit');
      
      const response = await HttpClient.get<any>(
        this.profileUrl,
        { 
          Authorization: `Bearer ${accessToken}`,
          'User-Agent': 'unified-oauth/1.0'
        },
        'reddit'
      );

      return {
        id: response.id,
        name: response.name,
        avatar: response.icon_img,
        provider: 'reddit',
        raw: response
      };
    } catch (error) {
      throw new ProfileFetchError(`Failed to fetch user profile: ${error}`, 400);
    }
  }
}