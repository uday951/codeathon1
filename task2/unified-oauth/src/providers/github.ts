/**
 * GitHub OAuth provider implementation
 */

import { OAuthProvider, ProviderConfig, OAuthResponse, UserProfile } from '../types';
import { HttpClient } from '../utils/httpClient';
import { TokenExchangeError, ProfileFetchError } from '../errors/CustomError';
import { logger } from '../utils/logger';

export class GitHubProvider implements OAuthProvider {
  private config: ProviderConfig;
  private readonly authUrl = 'https://github.com/login/oauth/authorize';
  private readonly tokenUrl = 'https://github.com/login/oauth/access_token';
  private readonly profileUrl = 'https://api.github.com/user';

  constructor(config: ProviderConfig) {
    this.config = config;
  }

  /**
   * Generate GitHub OAuth authorization URL
   */
  getAuthUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scopes?.join(' ') || 'user:email',
      ...(state && { state })
    });

    const url = `${this.authUrl}?${params.toString()}`;
    logger.info('Generated auth URL', 'github');
    return url;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<OAuthResponse> {
    try {
      logger.info('Exchanging code for token', 'github');
      
      const data = {
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        code
      };

      const response = await HttpClient.post<any>(this.tokenUrl, data, {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }, 'github');

      return {
        accessToken: response.access_token,
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
      logger.info('Fetching user profile', 'github');
      
      const response = await HttpClient.get<any>(
        this.profileUrl,
        { 
          Authorization: `Bearer ${accessToken}`,
          'User-Agent': 'unified-oauth'
        },
        'github'
      );

      return {
        id: response.id.toString(),
        email: response.email,
        name: response.name,
        firstName: response.name?.split(' ')[0],
        lastName: response.name?.split(' ').slice(1).join(' '),
        avatar: response.avatar_url,
        provider: 'github',
        raw: response
      };
    } catch (error) {
      throw new ProfileFetchError(`Failed to fetch user profile: ${error}`, 400);
    }
  }
}