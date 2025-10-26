/**
 * LinkedIn OAuth provider implementation
 */

import { OAuthProvider, ProviderConfig, OAuthResponse, UserProfile } from '../types';
import { HttpClient } from '../utils/httpClient';
import { TokenExchangeError, ProfileFetchError } from '../errors/CustomError';
import { logger } from '../utils/logger';

export class LinkedInProvider implements OAuthProvider {
  private config: ProviderConfig;
  private readonly authUrl = 'https://www.linkedin.com/oauth/v2/authorization';
  private readonly tokenUrl = 'https://www.linkedin.com/oauth/v2/accessToken';
  private readonly profileUrl = 'https://api.linkedin.com/v2/people/~';

  constructor(config: ProviderConfig) {
    this.config = config;
  }

  /**
   * Generate LinkedIn OAuth authorization URL
   */
  getAuthUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: this.config.scopes?.join(' ') || 'r_liteprofile r_emailaddress',
      ...(state && { state })
    });

    const url = `${this.authUrl}?${params.toString()}`;
    logger.info('Generated auth URL', 'linkedin');
    return url;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<OAuthResponse> {
    try {
      logger.info('Exchanging code for token', 'linkedin');
      
      const data = new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: this.config.redirectUri
      });

      const response = await HttpClient.post<any>(this.tokenUrl, data, {
        'Content-Type': 'application/x-www-form-urlencoded'
      }, 'linkedin');

      return {
        accessToken: response.access_token,
        expiresIn: response.expires_in,
        tokenType: response.token_type
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
      logger.info('Fetching user profile', 'linkedin');
      
      const response = await HttpClient.get<any>(
        `${this.profileUrl}:(id,firstName,lastName,profilePicture(displayImage~:playableStreams))`,
        { Authorization: `Bearer ${accessToken}` },
        'linkedin'
      );

      const firstName = response.firstName?.localized?.en_US || '';
      const lastName = response.lastName?.localized?.en_US || '';
      const avatar = response.profilePicture?.['displayImage~']?.elements?.[0]?.identifiers?.[0]?.identifier;

      return {
        id: response.id,
        name: `${firstName} ${lastName}`.trim(),
        firstName,
        lastName,
        avatar,
        provider: 'linkedin',
        raw: response
      };
    } catch (error) {
      throw new ProfileFetchError(`Failed to fetch user profile: ${error}`, 400);
    }
  }
}