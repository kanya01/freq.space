// backend/server.js - Updated with tracks routes
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
const contentRoutes = require('./routes/content');
const trackRoutes = require('./routes/tracks'); // Import track routes
const postRoutes = require('./routes/posts');
// const initializeSocket = require('./config/socket'); // We'll create this later

// Connect to Database
connectDB();

const app = express();

// Ensure upload directories exist
const uploadDirs = [
    'uploads',
    'uploads/avatars',
    'uploads/covers',
    'uploads/portfolio',
    'uploads/tracks',    // New directory for tracks
    'uploads/content',
    'uploads/waveforms',
    'uploads/posts'// New directory for waveform data
];

uploadDirs.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Created directory: ${dirPath}`);
    }
});

// Init Middleware
app.use(cors({
    origin: 'https://freq-space-spring-frost-3404.fly.dev', // In production, restrict this to your frontend domain
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

// Serve static files
app.use('/uploads', (req, res, next) => {
    console.log(`Static file request: ${req.url}`);
    // Add headers to allow cross-origin access to files
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
}, express.static(path.join(__dirname, 'uploads')));


// API Routes
app.use('/api/v1/auth', authRoutes); // Use auth routes
app.use('/api/v1/onboarding', onboardingRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/content', contentRoutes);
app.use('/api/v1/tracks', trackRoutes); // Add tracks routes
app.use('/api/v1/posts', postRoutes);

const PORT = process.env.PORT || 5001;

// Setup HTTP server and Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow requests from frontend dev server (adjust for production!)
        methods: ["GET", "POST"]
    }
});

// Initialize Socket.IO logic
io.on('connection', (socket) => {
    console.log('a user connected:', socket.id);

    // Handle track play events
    socket.on('track:play', (trackId) => {
        // Broadcast to other users that someone is playing this track
        socket.broadcast.emit('track:playing', {
            trackId,
            userId: socket.userId // If user ID is set during authentication
        });
    });

    // Handle live comments
    socket.on('track:comment', (data) => {
        // Broadcast new comments to all users viewing the same track
        socket.broadcast.emit('track:new-comment', data);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected:', socket.id);
    });
});

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.error(`Error: ${err.message}`);
    // Close server & exit process (optional)
    // server.close(() => process.exit(1));
});