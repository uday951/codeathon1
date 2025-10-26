/**
 * Basic tests for OAuthManager
 */

import { OAuthManager } from '../src/core/OAuthManager';
import { ProviderConfig } from '../src/types';

describe('OAuthManager', () => {
  const mockConfig: ProviderConfig = {
    clientId: 'test-client-id',
    clientSecret: 'test-client-secret',
    redirectUri: 'http://localhost:3000/callback',
    scopes: ['email', 'profile']
  };

  let oauthManager: OAuthManager;

  beforeEach(() => {
    oauthManager = new OAuthManager({
      google: mockConfig,
      github: mockConfig
    });
  });

  test('should initialize with configured providers', () => {
    const providers = oauthManager.getConfiguredProviders();
    expect(providers).toContain('google');
    expect(providers).toContain('github');
    expect(providers).toHaveLength(2);
  });

  test('should check if provider is configured', () => {
    expect(oauthManager.isProviderConfigured('google')).toBe(true);
    expect(oauthManager.isProviderConfigured('facebook')).toBe(false);
  });

  test('should generate auth URL for configured provider', () => {
    const authUrl = oauthManager.getAuthUrl('google', 'test-state');
    expect(authUrl).toContain('accounts.google.com');
    expect(authUrl).toContain('client_id=test-client-id');
    expect(authUrl).toContain('state=test-state');
  });

  test('should throw error for unconfigured provider', () => {
    expect(() => {
      oauthManager.getAuthUrl('facebook' as any);
    }).toThrow('Unsupported provider: facebook');
  });
});

// Mock implementations for testing
jest.mock('../src/utils/httpClient', () => ({
  HttpClient: {
    get: jest.fn(),
    post: jest.fn()
  }
}));

jest.mock('../src/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  }
}));