// backend/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Helper function to generate JWT
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token expiration (e.g., 30 days)
    });
};

// @route   POST api/v1/auth/register
// @desc    Register a new user
// @access  Public
exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password /* add onboarding fields if sent during reg */ } = req.body;

    try {
        // Check if user already exists (by email or username)
        let user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) {
            const field = user.email === email ? 'Email' : 'Username';
            return res.status(400).json({ errors: [{ msg: `${field} already exists` }] });
        }

        // Create new user instance (password hashing is handled by pre-save hook)
        user = new User({
            username,
            email,
            password,
            // profile: { experienceLevel, skills } // if handling onboarding here
        });

        await user.save();

        // Generate JWT
        const token = generateToken(user._id);

        // Return user info (without password) and token
        const userResponse = await User.findById(user._id); // Re-fetch to exclude password

        res.status(201).json({
            token,
            user: userResponse
        });

    } catch (error) {
        console.error('Registration Error:', error.message);
        // Handle specific errors like validation errors if needed
        if (error.name === 'ValidationError') {
            return res.status(400).json({ errors: Object.values(error.errors).map(e => ({ msg: e.message })) });
        }
        res.status(500).send('Server error during registration');
    }
};

// @route   POST api/v1/auth/login
// @desc    Authenticate user & get token
// @access  Public
exports.loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body; // Assuming login via email

    try {
        // Find user by email
        // Need to explicitly select password as it's hidden by default
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

        // Compare passwords using the method defined in the User model
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

        // Generate JWT
        const token = generateToken(user._id);

        // Return user info (without password) and token
        const userResponse = await User.findById(user._id); // Re-fetch to exclude password

        res.json({
            token,
            user: userResponse
        });

    } catch (error) {
        console.error('Login Error:', error.message);
        res.status(500).send('Server error during login');
    }
};

// @route   GET api/v1/auth/me
// @desc    Get current logged in user data (using token)
// @access  Private (Requires authentication middleware)
exports.getMe = async (req, res) => {
    try {
        // req.user should be populated by the auth middleware
        if (!req.user || !req.user.id) {
            return res.status(401).json({ msg: 'Not authorized, user data missing' });
        }
        // Fetch user data excluding password
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('GetMe Error:', error.message);
        res.status(500).send('Server Error');
    }
};