const jwt = require('jsonwebtoken');

const authMiddleware = {
  // JWT Authentication middleware
  authenticateToken: (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Invalid or expired token'
        });
      }
      req.user = user;
      next();
    });
  },

  // Admin role check
  requireAdmin: (req, res, next) => {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }
    next();
  }
};

module.exports = authMiddleware;