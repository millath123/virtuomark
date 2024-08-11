import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to protect routes by requiring a valid JWT
export const protect = async (req, res, next) => {
  let token;

  // Check if the token is sent in the request cookies
  if (req.cookies.token) {
    try {
      token = req.cookies.token;
      
      // Verify the token using the JWT secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Attach the user to the request object (without password)
      req.user = await User.findById(decoded.id).select('-password');
      
      // Add role from JWT to the request object
      req.user.role = decoded.role;
      
      next(); // Proceed to the next middleware
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware to restrict access to admin-only routes
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // Proceed if user is admin
  } else {
    res.status(403).json({ message: 'Admin access only' });
  }
};
