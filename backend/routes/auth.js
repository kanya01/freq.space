// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../middleware/validators'); // Adjust path if needed
const { authenticateToken } = require('../middleware/authMiddleware'); // We'll create this next

// @route   POST api/v1/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerValidation, authController.registerUser);

// @route   POST api/v1/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', loginValidation, authController.loginUser);

// @route   GET api/v1/auth/me
// @desc    Get current logged in user data
// @access  Private
router.get('/me', authenticateToken, authController.getMe); // Requires auth middleware

module.exports = router;