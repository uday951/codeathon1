/**
 * Example Express application using unified-oauth
 */

import express from 'express';
import { OAuthManager, ProviderConfig, SupportedProvider } from '../src/index';

const app = express();
const port = 3000;

// OAuth configuration
const oauthConfigs: Partial<Record<SupportedProvider, ProviderConfig>> = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || 'your-google-client-id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret',
    redirectUri: 'http://localhost:3000/auth/google/callback',
    scopes: ['openid', 'email', 'profile']
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID || 'your-github-client-id',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || 'your-github-client-secret',
    redirectUri: 'http://localhost:3000/auth/github/callback',
    scopes: ['user:email']
  }
};

// Initialize OAuth manager
const oauthManager = new OAuthManager(oauthConfigs);

app.use(express.json());

/**
 * Home route with login links
 */
app.get('/', (req, res) => {
  const providers = oauthManager.getConfiguredProviders();
  const loginLinks = providers.map(provider => 
    `<a href="/auth/${provider}">Login with ${provider.charAt(0).toUpperCase() + provider.slice(1)}</a>`
  ).join('<br>');
  
  res.send(`
    <h1>Unified OAuth Example</h1>
    <p>Choose a provider to login:</p>
    ${loginLinks}
  `);
});

/**
 * Initiate OAuth flow for any provider
 */
app.get('/auth/:provider', (req, res) => {
  try {
    const provider = req.params.provider as SupportedProvider;
    const state = Math.random().toString(36).substring(7); // Simple state for demo
    
    if (!oauthManager.isProviderConfigured(provider)) {
      return res.status(400).json({ error: `Provider ${provider} is not configured` });
    }
    
    const authUrl = oauthManager.getAuthUrl(provider, state);
    res.redirect(authUrl);
  } catch (error) {
    console.error('Auth initiation error:', error);
    res.status(500).json({ error: 'Failed to initiate authentication' });
  }
});

/**
 * Handle OAuth callback for any provider
 */
app.get('/auth/:provider/callback', async (req, res) => {
  try {
    const provider = req.params.provider as SupportedProvider;
    const { code, error } = req.query;
    
    if (error) {
      return res.status(400).json({ error: `OAuth error: ${error}` });
    }
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code not provided' });
    }
    
    // Complete OAuth flow
    const { token, profile } = await oauthManager.completeOAuth(provider, code as string);
    
    // In a real app, you would:
    // 1. Save the user profile to your database
    // 2. Create a session or JWT token
    // 3. Redirect to your app's dashboard
    
    res.json({
      success: true,
      provider,
      profile: {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        avatar: profile.avatar
      },
      token: {
        accessToken: token.accessToken.substring(0, 10) + '...', // Truncated for security
        expiresIn: token.expiresIn
      }
    });
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

/**
 * Get user profile using stored access token
 */
app.post('/profile/:provider', async (req, res) => {
  try {
    const provider = req.params.provider as SupportedProvider;
    const { accessToken } = req.body;
    
    if (!accessToken) {
      return res.status(400).json({ error: 'Access token required' });
    }
    
    const profile = await oauthManager.getUserProfile(provider, accessToken);
    res.json({ profile });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log('Configured providers:', oauthManager.getConfiguredProviders());
});

export default app;