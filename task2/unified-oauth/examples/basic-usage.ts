/**
 * Basic usage example of unified-oauth
 */

import { OAuthManager, ProviderConfig, SupportedProvider } from '../src/index';

// Example configuration
const configs: Partial<Record<SupportedProvider, ProviderConfig>> = {
  google: {
    clientId: 'your-google-client-id',
    clientSecret: 'your-google-client-secret',
    redirectUri: 'http://localhost:3000/auth/google/callback',
    scopes: ['openid', 'email', 'profile']
  },
  github: {
    clientId: 'your-github-client-id',
    clientSecret: 'your-github-client-secret',
    redirectUri: 'http://localhost:3000/auth/github/callback',
    scopes: ['user:email']
  }
};

async function example() {
  // Initialize OAuth manager
  const oauthManager = new OAuthManager(configs);

  // Check configured providers
  console.log('Configured providers:', oauthManager.getConfiguredProviders());

  // Generate authorization URL
  const googleAuthUrl = oauthManager.getAuthUrl('google', 'random-state-123');
  console.log('Google Auth URL:', googleAuthUrl);

  // Example of completing OAuth flow (you would get the code from the callback)
  try {
    // This would normally come from your OAuth callback
    const authCode = 'example-auth-code-from-callback';
    
    // Complete OAuth flow
    const { token, profile } = await oauthManager.completeOAuth('google', authCode);
    
    console.log('User Profile:', {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      provider: profile.provider
    });
    
    console.log('Access Token (truncated):', token.accessToken.substring(0, 10) + '...');
  } catch (error) {
    console.error('OAuth flow failed:', error);
  }
}

// Run example (commented out to prevent actual execution)
// example().catch(console.error);

export default example;