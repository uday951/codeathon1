const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // Check if user is authenticated via session
    if (req.isAuthenticated && req.isAuthenticated()) {
      req.user = req.user;
      return next();
    }
    
    // Check for JWT token in headers or cookies
    let token = req.header('Authorization')?.replace('Bearer ', '');
    
    // If no token in headers, check cookies
    if (!token) {
      token = req.cookies.auth_token;
    }
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    console.log('Token found:', token ? 'Yes' : 'No');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }
    
    console.log('User authenticated:', user.name);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;