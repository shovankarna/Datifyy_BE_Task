// src/routes/authRoutes.js
const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const { pool } = require('../db/db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Apply rate limiting to the login route
const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts from this IP, please try again after a minute',
});

// Secret key for JWT (this should be kept secret, typically stored in environment variables)
const JWT_SECRET = process.env.SECRET_KEY; // Replace with your own secret key

// Middleware for token verification
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Route for user registration (sign up)
router.post('/register', async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  // Verify that passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  // Check if username or email already exists
  const userExists = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);

  if (userExists.rows.length > 0) {
    return res.status(400).json({ message: 'Username or email already exists' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert the user into the database
  try {
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );

    // Generate JWT token
    const token = jwt.sign({ userId: result.rows[0].id }, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour

    res.status(201).json({ user: result.rows[0], token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Route for user authentication (login) with rate limiting
router.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists based on the email
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if the provided password matches the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.rows[0].password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.rows[0].id }, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour

    res.json({ user: user.rows[0], token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Example route for testing token validation
router.get('/protected-route', authenticateToken, (req, res) => {
  // Accessible only if the token is valid
  res.json({ message: 'This is a protected route' });
});

module.exports = router;
