const express = require('express');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get current user profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    console.log('User from DB:', req.user);
    const user = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      picture: req.user.picture
    };
    console.log('Sending user data:', user);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;