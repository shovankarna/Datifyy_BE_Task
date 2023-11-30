// src/index.js
const express = require('express');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const { createUsersTable } = require('./db/db.js'); // Import the createUsersTable function
const rateLimitMiddleware = require('./middleware/rateLimiterMiddleware.js');

dotenv.config();

// Create users table if not exists
createUsersTable();

const app = express();
// app.use(rateLimitMiddleware);
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

// Apply the token authentication middleware to all routes
app.use(authRoutes); // Protect all routes defined in authRoutes.js

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Only start the server if this file is the main module
if (!module.parent) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

// Explicitly export the app
module.exports = app;
