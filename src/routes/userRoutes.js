// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Protected route to get all users
router.get('/get-all', authenticateToken, getAllUsers);

module.exports = router;
