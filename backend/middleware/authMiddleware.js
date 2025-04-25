// backend/middleware/authMiddleware.js
const passport = require('passport');

// Middleware to protect routes - using Passport's 'jwt' strategy
// session: false tells passport not to create a session cookie
exports.authenticateToken = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            console.error("Passport Auth Error:", err);
            return res.status(500).json({ msg: 'Authentication error' });
        }
        if (!user) {
            // Check for specific JWT errors from the 'info' object if needed
            let message = 'Unauthorized: No user found or invalid token';
            if (info instanceof Error) {
                message = `Unauthorized: ${info.message}`; // e.g., 'jwt expired', 'invalid signature'
            } else if (typeof info === 'string') {
                message = `Unauthorized: ${info}`;
            }
            console.warn("Auth Middleware Denied Access:", message);
            return res.status(401).json({ msg: message });
        }
        // If authentication is successful, passport attaches the user to req.user
        req.user = user;
        next(); // Proceed to the next middleware or route handler
    })(req, res, next); // This invokes the passport middleware
};

// Optional: Middleware to check for specific roles (if needed later)
// exports.isAdmin = (req, res, next) => {
//     if (req.user && req.user.role === 'admin') {
//         next();
//     } else {
//         res.status(403).json({ msg: 'Forbidden: Admin access required' });
//     }
// };