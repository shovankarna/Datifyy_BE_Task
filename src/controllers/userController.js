// src/controllers/userController.js
const { pool } = require('../db/db');

// Function to get all users
const getAllUsers = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = {
  getAllUsers,
};
