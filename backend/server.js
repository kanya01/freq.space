// backend/server.js
require('dotenv').config(); // Load .env variables first
const express = require('express');
const http = require('http'); // Required for Socket.IO
const { Server } = require("socket.io"); // Socket.IO server class
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const passport = require('passport'); // Import passport
const onboardingRoutes = require('./routes/onboarding'); // Import onboarding routes
const profileRoutes = require('./routes/profile');
// const initializeSocket = require('./config/socket'); // We'll create this later

// Connect to Database
connectDB();

const app = express();


const uploadDirs = ['uploads', 'uploads/avatars', 'uploads/covers', 'uploads/portfolio'];
uploadDirs.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Created directory: ${dirPath}`);
    }
});

// Init Middleware
app.use(cors({
    origin: '*', // In production, restrict this to your frontend domain
    credentials: true,
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
})); // Enable CORS for all origins (adjust for production)
app.use(express.json()); // Parse JSON request bodies


// Passport middleware initialization
app.use(passport.initialize());
// Configure Passport
require('./config/passport')(passport);

// Basic Route for testing
app.get('/', (req, res) => res.send('API Running'));

//  Routes
// app.use('/api/v1/auth', require('./routes/auth'));
// app.use('/api/v1/users', require('./routes/users'));
// ... etc
//serve static files
app.use('/uploads', (req, res, next) => {
    // Add headers to allow cross-origin access to images
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
}, express.static(path.join(__dirname, 'uploads')));

app.use('/uploads', (req, res, next) => {
    console.log(`Static file request: ${req.url}`);
    next();
});

app.get('/', (req, res) => res.send('API Running')); // Keep basic test route
app.use('/api/v1/auth', authRoutes); // Use auth routes
app.use('/api/v1/onboarding', onboardingRoutes);
app.use('/api/v1/profile', profileRoutes);



const PORT = process.env.PORT || 5001;

// Setup HTTP server and Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow requests from frontend dev server (adjust for production!)
        methods: ["GET", "POST"]
    }
});

// Initialize Socket.IO logic (we'll create this function later)
// initializeSocket(io);

io.on('connection', (socket) => {
    console.log('a user connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('user disconnected:', socket.id);
    });
    // Add more socket event listeners later for messaging
});


server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.error(`Error: ${err.message}`);
    // Close server & exit process (optional)
    // server.close(() => process.exit(1));
});
// log unhandled rejections
// app.use((err, req, res, next) => {
//     console.error('Unhandled error:', err);
//     res.status(500).json({
//         message: 'Internal server error',
//         error: process.env.NODE_ENV === 'development' ? err.message : undefined
//     });
// });