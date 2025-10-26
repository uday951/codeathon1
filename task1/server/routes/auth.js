const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Google OAuth login
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/login` }),
  async (req, res) => {
    try {
      // Generate JWT token
      const token = jwt.sign(
        { userId: req.user._id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      // Set cookie
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax',
        domain: 'localhost' // Allow cookie to work across localhost ports
      });
      
      console.log('\n=== GOOGLE OAUTH CALLBACK ===');
      console.log('User authenticated:', req.user.name);
      console.log('JWT Token generated:', token.substring(0, 50) + '...');
      console.log('✅ COOKIE SET SUCCESSFULLY!');
      console.log('Cookie name: auth_token');
      console.log('Cookie domain: localhost');
      console.log('=== CALLBACK COMPLETE ===\n');
      
      // Redirect to frontend with token (keeping both methods)
      res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${token}`);
    } catch (error) {
      console.error('Auth callback error:', error);
      res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
    }
  }
);

// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    
    // Clear cookie
    res.clearCookie('auth_token', {
      domain: 'localhost',
      sameSite: 'lax'
    });
    console.log('Cookie cleared for logout');
    
    req.session.destroy();
    res.json({ message: 'Logged out successfully' });
  });
});

module.exports = router;