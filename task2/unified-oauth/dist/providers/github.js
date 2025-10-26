"use strict";
/**
 * GitHub OAuth provider implementation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHubProvider = void 0;
const httpClient_1 = require("../utils/httpClient");
const CustomError_1 = require("../errors/CustomError");
const logger_1 = require("../utils/logger");
class GitHubProvider {
    constructor(config) {
        this.authUrl = 'https://github.com/login/oauth/authorize';
        this.tokenUrl = 'https://github.com/login/oauth/access_token';
        this.profileUrl = 'https://api.github.com/user';
        this.config = config;
    }
    /**
     * Generate GitHub OAuth authorization URL
     */
    getAuthUrl(state) {
        const params = new URLSearchParams({
            client_id: this.config.clientId,
            redirect_uri: this.config.redirectUri,
            scope: this.config.scopes?.join(' ') || 'user:email',
            ...(state && { state })
        });
        const url = `${this.authUrl}?${params.toString()}`;
        logger_1.logger.info('Generated auth URL', 'github');
        return url;
    }
    /**
     * Exchange authorization code for access token
     */
    async exchangeCodeForToken(code) {
        try {
            logger_1.logger.info('Exchanging code for token', 'github');
            const data = {
                client_id: this.config.clientId,
                client_secret: this.config.clientSecret,
                code
            };
            const response = await httpClient_1.HttpClient.post(this.tokenUrl, data, {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, 'github');
            return {
                accessToken: response.access_token,
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
            logger_1.logger.info('Fetching user profile', 'github');
            const response = await httpClient_1.HttpClient.get(this.profileUrl, {
                Authorization: `Bearer ${accessToken}`,
                'User-Agent': 'unified-oauth'
            }, 'github');
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
        }
        catch (error) {
            throw new CustomError_1.ProfileFetchError(`Failed to fetch user profile: ${error}`, 400);
        }
    }
}
exports.GitHubProvider = GitHubProvider;
//# sourceMappingURL=github.js.map