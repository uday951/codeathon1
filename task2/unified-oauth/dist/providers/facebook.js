"use strict";
/**
 * Facebook OAuth provider implementation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacebookProvider = void 0;
const httpClient_1 = require("../utils/httpClient");
const CustomError_1 = require("../errors/CustomError");
const logger_1 = require("../utils/logger");
class FacebookProvider {
    constructor(config) {
        this.authUrl = 'https://www.facebook.com/v18.0/dialog/oauth';
        this.tokenUrl = 'https://graph.facebook.com/v18.0/oauth/access_token';
        this.profileUrl = 'https://graph.facebook.com/v18.0/me';
        this.config = config;
    }
    /**
     * Generate Facebook OAuth authorization URL
     */
    getAuthUrl(state) {
        const params = new URLSearchParams({
            client_id: this.config.clientId,
            redirect_uri: this.config.redirectUri,
            response_type: 'code',
            scope: this.config.scopes?.join(',') || 'email,public_profile',
            ...(state && { state })
        });
        const url = `${this.authUrl}?${params.toString()}`;
        logger_1.logger.info('Generated auth URL', 'facebook');
        return url;
    }
    /**
     * Exchange authorization code for access token
     */
    async exchangeCodeForToken(code) {
        try {
            logger_1.logger.info('Exchanging code for token', 'facebook');
            const params = new URLSearchParams({
                client_id: this.config.clientId,
                client_secret: this.config.clientSecret,
                code,
                redirect_uri: this.config.redirectUri
            });
            const response = await httpClient_1.HttpClient.get(`${this.tokenUrl}?${params.toString()}`, {}, 'facebook');
            return {
                accessToken: response.access_token,
                tokenType: response.token_type,
                expiresIn: response.expires_in
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
            logger_1.logger.info('Fetching user profile', 'facebook');
            const params = new URLSearchParams({
                fields: 'id,name,email,first_name,last_name,picture',
                access_token: accessToken
            });
            const response = await httpClient_1.HttpClient.get(`${this.profileUrl}?${params.toString()}`, {}, 'facebook');
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
        }
        catch (error) {
            throw new CustomError_1.ProfileFetchError(`Failed to fetch user profile: ${error}`, 400);
        }
    }
}
exports.FacebookProvider = FacebookProvider;
//# sourceMappingURL=facebook.js.map