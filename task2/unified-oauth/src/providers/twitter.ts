/**
 * Twitter OAuth provider implementation
 */

import { OAuthProvider, ProviderConfig, OAuthResponse, UserProfile } from '../types';
import { HttpClient } from '../utils/httpClient';
import { TokenExchangeError, ProfileFetchError } from '../errors/CustomError';
import { logger } from '../utils/logger';

export class TwitterProvider implements OAuthProvider {
  private config: ProviderConfig;
  private readonly authUrl = 'https://twitter.com/i/oauth2/authorize';
  private readonly tokenUrl = 'https://api.twitter.com/2/oauth2/token';
  private readonly profileUrl = 'https://api.twitter.com/2/users/me';

  constructor(config: ProviderConfig) {
    this.config = config;
  }

  /**
   * Generate Twitter OAuth authorization URL
   */
  getAuthUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: this.config.scopes?.join(' ') || 'tweet.read users.read',
      code_challenge_method: 'plain',
      code_challenge: 'challenge',
      ...(state && { state })
    });

    const url = `${this.authUrl}?${params.toString()}`;
    logger.info('Generated auth URL', 'twitter');
    return url;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<OAuthResponse> {
    try {
      logger.info('Exchanging code for token', 'twitter');
      
      const data = new URLSearchParams({
        client_id: this.config.clientId,
        code,
        grant_type: 'authorization_code',
        redirect_uri: this.config.redirectUri,
        code_verifier: 'challenge'
      });

      const credentials = Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64');

      const response = await HttpClient.post<any>(this.tokenUrl, data, {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }, 'twitter');

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
      logger.info('Fetching user profile', 'twitter');
      
      const params = new URLSearchParams({
        'user.fields': 'id,name,username,profile_image_url'
      });

      const response = await HttpClient.get<any>(
        `${this.profileUrl}?${params.toString()}`,
        { Authorization: `Bearer ${accessToken}` },
        'twitter'
      );

      const user = response.data;
      return {
        id: user.id,
        name: user.name,
        firstName: user.name?.split(' ')[0],
        lastName: user.name?.split(' ').slice(1).join(' '),
        avatar: user.profile_image_url,
        provider: 'twitter',
        raw: response
      };
    } catch (error) {
      throw new ProfileFetchError(`Failed to fetch user profile: ${error}`, 400);
    }
  }
}