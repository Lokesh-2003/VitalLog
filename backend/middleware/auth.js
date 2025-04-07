const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    // 1) Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'Authorization token required',
        code: 'NO_TOKEN'
      });
    }

    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3) Find user
    const user = await User.findById(decoded.user.id).select('-password');
    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // 4) Attach user to request (without password)
    req.user = user;
    
    // 5) Continue to next middleware
    next();
  } catch (err) {
    console.error(`Auth error: ${err.message}`, {
      path: req.path,
      ip: req.ip
    });
    
    const message = err.name === 'JsonWebTokenError' 
      ? 'Invalid token' 
      : err.name === 'TokenExpiredError'
      ? 'Token expired'
      : 'Authentication failed';

    res.status(401).json({ 
      success: false,
      error: message,
      code: 'AUTH_FAILED'
    });
  }
};