/**
 * Main entry point for the unified-oauth package
 */

// Core exports
export { OAuthManager } from './core/OAuthManager';

// Provider exports
export { GoogleProvider } from './providers/google';
export { GitHubProvider } from './providers/github';
export { FacebookProvider } from './providers/facebook';
export { TwitterProvider } from './providers/twitter';
export { InstagramProvider } from './providers/instagram';
export { LinkedInProvider } from './providers/linkedin';
export { RedditProvider } from './providers/reddit';

// Type exports
export * from './types';

// Error exports
export * from './errors/CustomError';

// Utility exports
export { Logger, logger } from './utils/logger';
export { HttpClient } from './utils/httpClient';