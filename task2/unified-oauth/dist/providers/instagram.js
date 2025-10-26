"use strict";
/**
 * Instagram OAuth provider implementation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstagramProvider = void 0;
const httpClient_1 = require("../utils/httpClient");
const CustomError_1 = require("../errors/CustomError");
const logger_1 = require("../utils/logger");
class InstagramProvider {
    constructor(config) {
        this.authUrl = 'https://api.instagram.com/oauth/authorize';
        this.tokenUrl = 'https://api.instagram.com/oauth/access_token';
        this.profileUrl = 'https://graph.instagram.com/me';
        this.config = config;
    }
    /**
     * Generate Instagram OAuth authorization URL
     */
    getAuthUrl(state) {
        const params = new URLSearchParams({
            client_id: this.config.clientId,
            redirect_uri: this.config.redirectUri,
            response_type: 'code',
            scope: this.config.scopes?.join(',') || 'user_profile,user_media',
            ...(state && { state })
        });
        const url = `${this.authUrl}?${params.toString()}`;
        logger_1.logger.info('Generated auth URL', 'instagram');
        return url;
    }
    /**
     * Exchange authorization code for access token
     */
    async exchangeCodeForToken(code) {
        try {
            logger_1.logger.info('Exchanging code for token', 'instagram');
            const data = new URLSearchParams({
                client_id: this.config.clientId,
                client_secret: this.config.clientSecret,
                code,
                grant_type: 'authorization_code',
                redirect_uri: this.config.redirectUri
            });
            const response = await httpClient_1.HttpClient.post(this.tokenUrl, data, {
                'Content-Type': 'application/x-www-form-urlencoded'
            }, 'instagram');
            return {
                accessToken: response.access_token,
                tokenType: 'Bearer'
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
            logger_1.logger.info('Fetching user profile', 'instagram');
            const params = new URLSearchParams({
                fields: 'id,username,account_type',
                access_token: accessToken
            });
            const response = await httpClient_1.HttpClient.get(`${this.profileUrl}?${params.toString()}`, {}, 'instagram');
            return {
                id: response.id,
                name: response.username,
                provider: 'instagram',
                raw: response
            };
        }
        catch (error) {
            throw new CustomError_1.ProfileFetchError(`Failed to fetch user profile: ${error}`, 400);
        }
    }
}
exports.InstagramProvider = InstagramProvider;
//# sourceMappingURL=instagram.js.map