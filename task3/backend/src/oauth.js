import { OAuthManager } from 'unified-oauth';
import { config } from './config.js';
import { logger } from './logger.js';

// Initialize OAuth manager with all provider configs
// Facebook requires special scope configuration
const providerConfigs = {
  ...config.providers,
  facebook: {
    ...config.providers.facebook,
    scopes: ['public_profile'] // Only use basic scope that doesn't require approval
  }
};

export const oauthManager = new OAuthManager(providerConfigs);

logger.info('OAuth manager initialized with all providers');