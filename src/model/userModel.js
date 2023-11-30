// src/model/userModel.js
const { pool } = require('../db/db');

// Function to create a new user in the database
const createUser = async (username, email, password) => {
  const query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *';

  try {
    const result = await pool.query(query, [username, email, password]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Function to get a user by their username
const getUserByUsername = async (username) => {
  const query = 'SELECT * FROM users WHERE username = $1';

  try {
    const result = await pool.query(query, [username]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Function to get a user by their email
const getUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';

  try {
    const result = await pool.query(query, [email]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createUser,
  getUserByUsername,
  getUserByEmail,
};
