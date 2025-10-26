# Unified OAuth

A clean, scalable, TypeScript-based OAuth NPM package that supports multiple providers with a unified interface.

## Supported Providers

- Google
- GitHub
- Facebook
- Twitter
- Instagram
- LinkedIn
- Reddit

## Features

- 🔒 **Type-safe** - Full TypeScript support with comprehensive interfaces
- 🏗️ **Modular Architecture** - Clean, extensible design
- 📝 **Comprehensive Logging** - Built-in logging with multiple levels
- 🛡️ **Error Handling** - Centralized error management
- 🔧 **Easy Configuration** - Simple setup with environment variables
- 📦 **Production Ready** - Linted, tested, and ready to publish

## Installation

```bash
npm install unified-oauth
```

## Quick Start

```typescript
import { OAuthManager, ProviderConfig, SupportedProvider } from 'unified-oauth';

// Configure your OAuth providers
const configs: Partial<Record<SupportedProvider, ProviderConfig>> = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    redirectUri: 'http://localhost:3000/auth/google/callback',
    scopes: ['openid', 'email', 'profile']
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    redirectUri: 'http://localhost:3000/auth/github/callback',
    scopes: ['user:email']
  }
};

// Initialize the OAuth manager
const oauthManager = new OAuthManager(configs);

// Generate authorization URL
const authUrl = oauthManager.getAuthUrl('google', 'optional-state');

// Complete OAuth flow
const { token, profile } = await oauthManager.completeOAuth('google', authCode);
```

## Environment Variables

Create a `.env` file in your project root:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Facebook OAuth
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret

# Add other providers as needed...
```

## API Reference

### OAuthManager

The main class for managing OAuth operations across multiple providers.

#### Constructor

```typescript
new OAuthManager(configs: Partial<Record<SupportedProvider, ProviderConfig>>)
```

#### Methods

##### `getAuthUrl(provider, state?)`
Generate authorization URL for a provider.

```typescript
const authUrl = oauthManager.getAuthUrl('google', 'optional-state');
```

##### `exchangeCodeForToken(provider, code)`
Exchange authorization code for access token.

```typescript
const token = await oauthManager.exchangeCodeForToken('google', authCode);
```

##### `getUserProfile(provider, accessToken)`
Fetch user profile using access token.

```typescript
const profile = await oauthManager.getUserProfile('google', accessToken);
```

##### `completeOAuth(provider, code)`
Complete OAuth flow (exchange code + get profile).

```typescript
const { token, profile } = await oauthManager.completeOAuth('google', authCode);
```

### Types

#### ProviderConfig
```typescript
interface ProviderConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes?: string[];
}
```

#### UserProfile
```typescript
interface UserProfile {
  id: string;
  email?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  provider: string;
  raw?: any;
}
```

#### OAuthResponse
```typescript
interface OAuthResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  tokenType?: string;
  scope?: string;
}
```

## Express.js Example

See the complete example in `examples/express-app.ts`:

```typescript
import express from 'express';
import { OAuthManager } from 'unified-oauth';

const app = express();
const oauthManager = new OAuthManager(configs);

// Initiate OAuth
app.get('/auth/:provider', (req, res) => {
  const authUrl = oauthManager.getAuthUrl(req.params.provider);
  res.redirect(authUrl);
});

// Handle callback
app.get('/auth/:provider/callback', async (req, res) => {
  const { token, profile } = await oauthManager.completeOAuth(
    req.params.provider, 
    req.query.code
  );
  res.json({ profile });
});
```

## Logging

The package includes comprehensive logging:

```typescript
import { Logger } from 'unified-oauth';

const logger = new Logger({
  level: 'INFO', // DEBUG, INFO, WARN, ERROR
  timestamp: true
});

logger.info('OAuth flow started', 'google');
logger.error('Token exchange failed', 'github', error);
```

## Error Handling

All errors extend the base `OAuthError` class:

```typescript
import { OAuthError, TokenExchangeError, ProfileFetchError } from 'unified-oauth';

try {
  const result = await oauthManager.completeOAuth('google', code);
} catch (error) {
  if (error instanceof TokenExchangeError) {
    console.error('Token exchange failed:', error.message);
  } else if (error instanceof ProfileFetchError) {
    console.error('Profile fetch failed:', error.message);
  }
}
```

## Extending with New Providers

To add a new provider:

1. Create a new provider class in `src/providers/`:

```typescript
import { OAuthProvider, ProviderConfig, OAuthResponse, UserProfile } from '../types';

export class CustomProvider implements OAuthProvider {
  constructor(private config: ProviderConfig) {}
  
  getAuthUrl(state?: string): string {
    // Implementation
  }
  
  async exchangeCodeForToken(code: string): Promise<OAuthResponse> {
    // Implementation
  }
  
  async getUserProfile(accessToken: string): Promise<UserProfile> {
    // Implementation
  }
}
```

2. Add it to the `OAuthManager` provider classes map
3. Update the `SupportedProvider` type
4. Export from `index.ts`

## Provider-Specific Notes

### Google
- Requires `openid`, `email`, `profile` scopes for full profile access
- Supports refresh tokens with `access_type: 'offline'`

### GitHub
- Requires `user:email` scope for email access
- Uses Bearer token authentication

### Facebook
- Uses Graph API v18.0
- Requires `email`, `public_profile` permissions

### Twitter
- Uses OAuth 2.0 with PKCE
- Requires app to be approved for email access

### LinkedIn
- Uses v2 API
- Requires `r_liteprofile`, `r_emailaddress` scopes

### Instagram
- Basic Display API
- Limited to basic profile information

### Reddit
- Requires User-Agent header
- Uses Basic authentication for token exchange

## Development

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Run linting
npm run lint

# Watch mode for development
npm run dev
```

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## Support

For issues and questions, please use the GitHub issue tracker.