// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// Placeholder route to get all users
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
