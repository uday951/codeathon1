"use strict";
/**
 * Reddit OAuth provider implementation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedditProvider = void 0;
const httpClient_1 = require("../utils/httpClient");
const CustomError_1 = require("../errors/CustomError");
const logger_1 = require("../utils/logger");
class RedditProvider {
    constructor(config) {
        this.authUrl = 'https://www.reddit.com/api/v1/authorize';
        this.tokenUrl = 'https://www.reddit.com/api/v1/access_token';
        this.profileUrl = 'https://oauth.reddit.com/api/v1/me';
        this.config = config;
    }
    /**
     * Generate Reddit OAuth authorization URL
     */
    getAuthUrl(state) {
        const params = new URLSearchParams({
            client_id: this.config.clientId,
            redirect_uri: this.config.redirectUri,
            response_type: 'code',
            scope: this.config.scopes?.join(' ') || 'identity',
            duration: 'temporary',
            ...(state && { state })
        });
        const url = `${this.authUrl}?${params.toString()}`;
        logger_1.logger.info('Generated auth URL', 'reddit');
        return url;
    }
    /**
     * Exchange authorization code for access token
     */
    async exchangeCodeForToken(code) {
        try {
            logger_1.logger.info('Exchanging code for token', 'reddit');
            const data = new URLSearchParams({
                code,
                grant_type: 'authorization_code',
                redirect_uri: this.config.redirectUri
            });
            const credentials = Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64');
            const response = await httpClient_1.HttpClient.post(this.tokenUrl, data, {
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
            logger_1.logger.info('Fetching user profile', 'reddit');
            const response = await httpClient_1.HttpClient.get(this.profileUrl, {
                Authorization: `Bearer ${accessToken}`,
                'User-Agent': 'unified-oauth/1.0'
            }, 'reddit');
            return {
                id: response.id,
                name: response.name,
                avatar: response.icon_img,
                provider: 'reddit',
                raw: response
            };
        }
        catch (error) {
            throw new CustomError_1.ProfileFetchError(`Failed to fetch user profile: ${error}`, 400);
        }
    }
}
exports.RedditProvider = RedditProvider;
//# sourceMappingURL=reddit.js.map