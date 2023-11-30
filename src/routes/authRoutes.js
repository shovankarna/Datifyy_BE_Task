// src/routes/authRoutes.js
const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware'); // Add this line

// Apply rate limiting to the login route
const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts from this IP, please try again after a minute',
});

// Route for user registration (sign up)
router.post('/register', registerUser);

// Route for user authentication (login) with rate limiting
router.post('/login', loginLimiter, loginUser);

// Example route for testing token validation
router.get('/protected-route', authenticateToken, (req, res) => {
  // Accessible only if the token is valid
  res.json({ message: 'This is a protected route' });
});

module.exports = router;
