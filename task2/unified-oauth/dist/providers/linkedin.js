"use strict";
/**
 * LinkedIn OAuth provider implementation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkedInProvider = void 0;
const httpClient_1 = require("../utils/httpClient");
const CustomError_1 = require("../errors/CustomError");
const logger_1 = require("../utils/logger");
class LinkedInProvider {
    constructor(config) {
        this.authUrl = 'https://www.linkedin.com/oauth/v2/authorization';
        this.tokenUrl = 'https://www.linkedin.com/oauth/v2/accessToken';
        this.profileUrl = 'https://api.linkedin.com/v2/people/~';
        this.config = config;
    }
    /**
     * Generate LinkedIn OAuth authorization URL
     */
    getAuthUrl(state) {
        const params = new URLSearchParams({
            client_id: this.config.clientId,
            redirect_uri: this.config.redirectUri,
            response_type: 'code',
            scope: this.config.scopes?.join(' ') || 'r_liteprofile r_emailaddress',
            ...(state && { state })
        });
        const url = `${this.authUrl}?${params.toString()}`;
        logger_1.logger.info('Generated auth URL', 'linkedin');
        return url;
    }
    /**
     * Exchange authorization code for access token
     */
    async exchangeCodeForToken(code) {
        try {
            logger_1.logger.info('Exchanging code for token', 'linkedin');
            const data = new URLSearchParams({
                client_id: this.config.clientId,
                client_secret: this.config.clientSecret,
                code,
                grant_type: 'authorization_code',
                redirect_uri: this.config.redirectUri
            });
            const response = await httpClient_1.HttpClient.post(this.tokenUrl, data, {
                'Content-Type': 'application/x-www-form-urlencoded'
            }, 'linkedin');
            return {
                accessToken: response.access_token,
                expiresIn: response.expires_in,
                tokenType: response.token_type
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
            logger_1.logger.info('Fetching user profile', 'linkedin');
            const response = await httpClient_1.HttpClient.get(`${this.profileUrl}:(id,firstName,lastName,profilePicture(displayImage~:playableStreams))`, { Authorization: `Bearer ${accessToken}` }, 'linkedin');
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
        }
        catch (error) {
            throw new CustomError_1.ProfileFetchError(`Failed to fetch user profile: ${error}`, 400);
        }
    }
}
exports.LinkedInProvider = LinkedInProvider;
//# sourceMappingURL=linkedin.js.map