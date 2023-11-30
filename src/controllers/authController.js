// src/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, getUserByUsername, getUserByEmail } = require('../model/userModel');

const JWT_SECRET = process.env.SECRET_KEY;

// Function to handle user registration
const registerUser = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Validate username length
  if (username.length < 3) {
    return res.status(400).json({ message: 'Username must be at least 3 characters long' });
  }

  // Validate password length
  if (password.length < 3) {
    return res.status(400).json({ message: 'Password must be at least 3 characters long' });
  }

  // Verify that passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    // Check if username or email already exists
    const existingUsername = await getUserByUsername(username);
    const existingEmail = await getUserByEmail(email);

    if (existingUsername || existingEmail) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const newUser = await createUser(username, email, hashedPassword);

    // Generate JWT token
    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '1h' });

    // Send a response with only the necessary information
    res.status(201).json({ username: newUser.username, email: newUser.email, token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// Function to handle user login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Validate password length
  if (password.length < 3) {
    return res.status(400).json({ message: 'Password must be at least 3 characters long' });
  }

  try {
    // Check if the user exists based on the email
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if the provided password matches the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    // Send a response with only the necessary information
    res.json({ username: user.username, email: user.email, token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = {
  registerUser,
  loginUser,
};
