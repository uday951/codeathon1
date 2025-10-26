"use strict";
/**
 * Central OAuth manager for handling multiple providers
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthManager = void 0;
const google_1 = require("../providers/google");
const github_1 = require("../providers/github");
const facebook_1 = require("../providers/facebook");
const twitter_1 = require("../providers/twitter");
const instagram_1 = require("../providers/instagram");
const linkedin_1 = require("../providers/linkedin");
const reddit_1 = require("../providers/reddit");
const CustomError_1 = require("../errors/CustomError");
const logger_1 = require("../utils/logger");
class OAuthManager {
    /**
     * Initialize OAuth manager with provider configurations
     */
    constructor(configs) {
        this.providers = new Map();
        this.initializeProviders(configs);
    }
    /**
     * Initialize provider instances based on configurations
     */
    initializeProviders(configs) {
        const providerClasses = {
            google: google_1.GoogleProvider,
            github: github_1.GitHubProvider,
            facebook: facebook_1.FacebookProvider,
            twitter: twitter_1.TwitterProvider,
            instagram: instagram_1.InstagramProvider,
            linkedin: linkedin_1.LinkedInProvider,
            reddit: reddit_1.RedditProvider
        };
        Object.entries(configs).forEach(([provider, config]) => {
            if (config && providerClasses[provider]) {
                const ProviderClass = providerClasses[provider];
                this.providers.set(provider, new ProviderClass(config));
                logger_1.logger.info(`Initialized ${provider} provider`);
            }
        });
    }
    /**
     * Get authorization URL for a specific provider
     */
    getAuthUrl(provider, state) {
        const providerInstance = this.getProvider(provider);
        return providerInstance.getAuthUrl(state);
    }
    /**
     * Exchange authorization code for access token
     */
    async exchangeCodeForToken(provider, code) {
        const providerInstance = this.getProvider(provider);
        return await providerInstance.exchangeCodeForToken(code);
    }
    /**
     * Get user profile using access token
     */
    async getUserProfile(provider, accessToken) {
        const providerInstance = this.getProvider(provider);
        return await providerInstance.getUserProfile(accessToken);
    }
    /**
     * Complete OAuth flow: exchange code and get user profile
     */
    async completeOAuth(provider, code) {
        logger_1.logger.info(`Completing OAuth flow for ${provider}`);
        const token = await this.exchangeCodeForToken(provider, code);
        const profile = await this.getUserProfile(provider, token.accessToken);
        logger_1.logger.info(`OAuth flow completed successfully for ${provider}`);
        return { token, profile };
    }
    /**
     * Get provider instance
     */
    getProvider(provider) {
        const providerInstance = this.providers.get(provider);
        if (!providerInstance) {
            throw new CustomError_1.InvalidProviderError(provider);
        }
        return providerInstance;
    }
    /**
     * Get list of configured providers
     */
    getConfiguredProviders() {
        return Array.from(this.providers.keys());
    }
    /**
     * Check if a provider is configured
     */
    isProviderConfigured(provider) {
        return this.providers.has(provider);
    }
}
exports.OAuthManager = OAuthManager;
//# sourceMappingURL=OAuthManager.js.map