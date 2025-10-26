import express from 'express';
import { oauthManager } from './oauth.js';
import { saveUser } from './database.js';
import { logger } from './logger.js';
import { config } from './config.js';

const router = express.Router();

// Google OAuth
router.get('/auth/google', (req, res) => {
  try {
    const authUrl = oauthManager.getAuthUrl('google');
    res.redirect(authUrl);
  } catch (error) {
    logger.error('Google auth URL error:', error);
    res.redirect('http://localhost:5173/error?message=Google setup failed');
  }
});
router.get('/auth/google/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const profile = await oauthManager.getUserProfile('google', code);
    const user = await saveUser({
      id: profile.id,
      name: profile.name,
      email: profile.email,
      picture: profile.picture,
      provider: 'google'
    });
    const userData = encodeURIComponent(JSON.stringify(user));
    res.redirect(`http://localhost:5173/success?user=${userData}`);
  } catch (error) {
    logger.error('Google OAuth error:', error);
    res.redirect('http://localhost:5173/error?message=Google authentication failed');
  }
});

// GitHub OAuth - Custom implementation
router.get('/auth/github', (req, res) => {
  const clientId = config.providers.github.clientId;
  const redirectUri = config.providers.github.redirectUri;
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;
  res.redirect(authUrl);
});
router.get('/auth/github/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        client_id: config.providers.github.clientId,
        client_secret: config.providers.github.clientSecret,
        code,
        redirect_uri: config.providers.github.redirectUri
      })
    });
    const tokenData = await tokenResponse.json();
    const profileResponse = await fetch('https://api.github.com/user', {
      headers: { 'Authorization': `Bearer ${tokenData.access_token}` }
    });
    const profile = await profileResponse.json();
    const user = await saveUser({
      id: profile.id.toString(),
      name: profile.name || profile.login,
      email: profile.email,
      picture: profile.avatar_url,
      username: profile.login,
      provider: 'github'
    });
    const userData = encodeURIComponent(JSON.stringify(user));
    res.redirect(`http://localhost:5173/success?user=${userData}`);
  } catch (error) {
    logger.error('GitHub OAuth error:', error.message);
    res.redirect('http://localhost:5173/error?message=GitHub authentication failed');
  }
});

// Facebook OAuth - Custom implementation
router.get('/auth/facebook', (req, res) => {
  const clientId = config.providers.facebook.clientId;
  const redirectUri = config.providers.facebook.redirectUri;
  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=public_profile`;
  res.redirect(authUrl);
});
router.get('/auth/facebook/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const tokenResponse = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token?client_id=${config.providers.facebook.clientId}&client_secret=${config.providers.facebook.clientSecret}&code=${code}&redirect_uri=${config.providers.facebook.redirectUri}`);
    const tokenData = await tokenResponse.json();
    const profileResponse = await fetch(`https://graph.facebook.com/me?fields=id,name,picture&access_token=${tokenData.access_token}`);
    const profile = await profileResponse.json();
    const user = await saveUser({
      id: profile.id,
      name: profile.name,
      email: null,
      picture: profile.picture?.data?.url,
      provider: 'facebook'
    });
    const userData = encodeURIComponent(JSON.stringify(user));
    res.redirect(`http://localhost:5173/success?user=${userData}`);
  } catch (error) {
    logger.error('Facebook OAuth error:', error.message);
    res.redirect('http://localhost:5173/error?message=Facebook authentication failed');
  }
});

// LinkedIn OAuth
router.get('/auth/linkedin', (req, res) => {
  res.redirect('http://localhost:5173/error?message=LinkedIn not configured');
});
router.get('/auth/linkedin/callback', (req, res) => {
  res.redirect('http://localhost:5173/error?message=LinkedIn not configured');
});

// Twitter OAuth - Custom OAuth 1.0a implementation
router.get('/auth/twitter', async (req, res) => {
  try {
    const crypto = await import('crypto');
    const oauth_nonce = crypto.randomBytes(16).toString('hex');
    const oauth_timestamp = Math.floor(Date.now() / 1000);
    const oauth_signature_method = 'HMAC-SHA1';
    const oauth_version = '1.0';
    
    const params = {
      oauth_callback: config.providers.twitter.redirectUri,
      oauth_consumer_key: config.providers.twitter.consumerKey,
      oauth_nonce,
      oauth_signature_method,
      oauth_timestamp,
      oauth_version
    };
    
    const paramString = Object.keys(params)
      .sort()
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    const baseString = `POST&${encodeURIComponent('https://api.twitter.com/oauth/request_token')}&${encodeURIComponent(paramString)}`;
    const signingKey = `${encodeURIComponent(config.providers.twitter.consumerSecret)}&`;
    const oauth_signature = crypto.createHmac('sha1', signingKey).update(baseString).digest('base64');
    
    const authHeader = `OAuth oauth_callback="${encodeURIComponent(params.oauth_callback)}", oauth_consumer_key="${params.oauth_consumer_key}", oauth_nonce="${params.oauth_nonce}", oauth_signature="${encodeURIComponent(oauth_signature)}", oauth_signature_method="${params.oauth_signature_method}", oauth_timestamp="${params.oauth_timestamp}", oauth_version="${params.oauth_version}"`;
    
    const response = await fetch('https://api.twitter.com/oauth/request_token', {
      method: 'POST',
      headers: { 'Authorization': authHeader }
    });
    
    const responseText = await response.text();
    const tokenData = new URLSearchParams(responseText);
    const oauth_token = tokenData.get('oauth_token');
    
    res.redirect(`https://api.twitter.com/oauth/authenticate?oauth_token=${oauth_token}`);
  } catch (error) {
    logger.error('Twitter OAuth error:', error.message);
    res.redirect('http://localhost:5173/error?message=Twitter authentication failed');
  }
});
router.get('/auth/twitter/callback', async (req, res) => {
  try {
    const { oauth_token, oauth_verifier } = req.query;
    const crypto = await import('crypto');
    const oauth_nonce = crypto.randomBytes(16).toString('hex');
    const oauth_timestamp = Math.floor(Date.now() / 1000);
    
    const params = {
      oauth_consumer_key: config.providers.twitter.consumerKey,
      oauth_nonce,
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp,
      oauth_token,
      oauth_verifier,
      oauth_version: '1.0'
    };
    
    const paramString = Object.keys(params)
      .sort()
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    const baseString = `POST&${encodeURIComponent('https://api.twitter.com/oauth/access_token')}&${encodeURIComponent(paramString)}`;
    const signingKey = `${encodeURIComponent(config.providers.twitter.consumerSecret)}&`;
    const oauth_signature = crypto.createHmac('sha1', signingKey).update(baseString).digest('base64');
    
    const authHeader = `OAuth oauth_consumer_key="${params.oauth_consumer_key}", oauth_nonce="${params.oauth_nonce}", oauth_signature="${encodeURIComponent(oauth_signature)}", oauth_signature_method="${params.oauth_signature_method}", oauth_timestamp="${params.oauth_timestamp}", oauth_token="${params.oauth_token}", oauth_verifier="${params.oauth_verifier}", oauth_version="${params.oauth_version}"`;
    
    const response = await fetch('https://api.twitter.com/oauth/access_token', {
      method: 'POST',
      headers: { 'Authorization': authHeader }
    });
    
    const responseText = await response.text();
    const accessData = new URLSearchParams(responseText);
    
    const user = await saveUser({
      id: accessData.get('user_id'),
      name: accessData.get('screen_name'),
      username: accessData.get('screen_name'),
      provider: 'twitter'
    });
    
    const userData = encodeURIComponent(JSON.stringify(user));
    res.redirect(`http://localhost:5173/success?user=${userData}`);
  } catch (error) {
    logger.error('Twitter OAuth callback error:', error.message);
    res.redirect('http://localhost:5173/error?message=Twitter authentication failed');
  }
});

// Reddit OAuth
router.get('/auth/reddit', (req, res) => {
  try {
    const authUrl = oauthManager.getAuthUrl('reddit');
    res.redirect(authUrl);
  } catch (error) {
    logger.error('Reddit auth URL error:', error);
    res.redirect('http://localhost:5173/error?message=Reddit setup failed');
  }
});
router.get('/auth/reddit/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const profile = await oauthManager.getUserProfile('reddit', code);
    const user = await saveUser({
      id: profile.id,
      name: profile.name,
      username: profile.name,
      picture: profile.icon_img,
      provider: 'reddit'
    });
    const userData = encodeURIComponent(JSON.stringify(user));
    res.redirect(`http://localhost:5173/success?user=${userData}`);
  } catch (error) {
    logger.error('Reddit OAuth error:', error);
    res.redirect('http://localhost:5173/error?message=Reddit authentication failed');
  }
});

// Placeholder routes for unconfigured providers
router.get('/auth/instagram', (req, res) => {
  res.redirect('http://localhost:5173/error?message=Instagram OAuth not implemented');
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default router;