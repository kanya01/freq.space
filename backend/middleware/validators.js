// backend/middleware/validators.js
const { body } = require('express-validator');

exports.registerValidation = [
    body('username', 'Username is required and must be at least 3 characters').not().isEmpty().trim().isLength({ min: 3 }),
    body('email', 'Please include a valid email').isEmail().normalizeEmail(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 })
];

exports.loginValidation = [
    body('email', 'Please include a valid email').isEmail().normalizeEmail(),
    body('password', 'Password is required').exists()
];