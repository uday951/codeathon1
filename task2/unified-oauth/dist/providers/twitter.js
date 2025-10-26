"use strict";
/**
 * Twitter OAuth provider implementation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitterProvider = void 0;
const httpClient_1 = require("../utils/httpClient");
const CustomError_1 = require("../errors/CustomError");
const logger_1 = require("../utils/logger");
class TwitterProvider {
    constructor(config) {
        this.authUrl = 'https://twitter.com/i/oauth2/authorize';
        this.tokenUrl = 'https://api.twitter.com/2/oauth2/token';
        this.profileUrl = 'https://api.twitter.com/2/users/me';
        this.config = config;
    }
    /**
     * Generate Twitter OAuth authorization URL
     */
    getAuthUrl(state) {
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
        logger_1.logger.info('Generated auth URL', 'twitter');
        return url;
    }
    /**
     * Exchange authorization code for access token
     */
    async exchangeCodeForToken(code) {
        try {
            logger_1.logger.info('Exchanging code for token', 'twitter');
            const data = new URLSearchParams({
                client_id: this.config.clientId,
                code,
                grant_type: 'authorization_code',
                redirect_uri: this.config.redirectUri,
                code_verifier: 'challenge'
            });
            const credentials = Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64');
            const response = await httpClient_1.HttpClient.post(this.tokenUrl, data, {
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
        }
        catch (error) {
            throw new CustomError_1.TokenExchangeError(`Failed to exchange code for token: ${error}`, 400);
        }
    }
    /**
     * Fetch user profile using access token
     */
    async getUserProfile(accessToken) {
        try {
            logger_1.logger.info('Fetching user profile', 'twitter');
            const params = new URLSearchParams({
                'user.fields': 'id,name,username,profile_image_url'
            });
            const response = await httpClient_1.HttpClient.get(`${this.profileUrl}?${params.toString()}`, { Authorization: `Bearer ${accessToken}` }, 'twitter');
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
        }
        catch (error) {
            throw new CustomError_1.ProfileFetchError(`Failed to fetch user profile: ${error}`, 400);
        }
    }
}
exports.TwitterProvider = TwitterProvider;
//# sourceMappingURL=twitter.js.map