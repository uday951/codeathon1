"use strict";
/**
 * Google OAuth provider implementation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleProvider = void 0;
const httpClient_1 = require("../utils/httpClient");
const CustomError_1 = require("../errors/CustomError");
const logger_1 = require("../utils/logger");
class GoogleProvider {
    constructor(config) {
        this.authUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
        this.tokenUrl = 'https://oauth2.googleapis.com/token';
        this.profileUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';
        this.config = config;
    }
    /**
     * Generate Google OAuth authorization URL
     */
    getAuthUrl(state) {
        const params = new URLSearchParams({
            client_id: this.config.clientId,
            redirect_uri: this.config.redirectUri,
            response_type: 'code',
            scope: this.config.scopes?.join(' ') || 'openid email profile',
            access_type: 'offline',
            ...(state && { state })
        });
        const url = `${this.authUrl}?${params.toString()}`;
        logger_1.logger.info('Generated auth URL', 'google');
        return url;
    }
    /**
     * Exchange authorization code for access token
     */
    async exchangeCodeForToken(code) {
        try {
            logger_1.logger.info('Exchanging code for token', 'google');
            const data = {
                client_id: this.config.clientId,
                client_secret: this.config.clientSecret,
                code,
                grant_type: 'authorization_code',
                redirect_uri: this.config.redirectUri
            };
            const response = await httpClient_1.HttpClient.post(this.tokenUrl, data, {
                'Content-Type': 'application/x-www-form-urlencoded'
            }, 'google');
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
            logger_1.logger.info('Fetching user profile', 'google');
            const response = await httpClient_1.HttpClient.get(this.profileUrl, { Authorization: `Bearer ${accessToken}` }, 'google');
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
        }
        catch (error) {
            throw new CustomError_1.ProfileFetchError(`Failed to fetch user profile: ${error}`, 400);
        }
    }
}
exports.GoogleProvider = GoogleProvider;
//# sourceMappingURL=google.js.map