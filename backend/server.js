// backend/server.js
require('dotenv').config(); // Load .env variables first
const express = require('express');
const http = require('http'); // Required for Socket.IO
const { Server } = require("socket.io"); // Socket.IO server class
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const passport = require('passport'); // Import passport
// const initializeSocket = require('./config/socket'); // We'll create this later

// Connect to Database
connectDB();

const app = express();

// Init Middleware
app.use(cors()); // Enable CORS for all origins (adjust for production)
app.use(express.json()); // Parse JSON request bodies


// Passport middleware initialization
app.use(passport.initialize());
// Configure Passport
require('./config/passport')(passport);

// Basic Route for testing
app.get('/', (req, res) => res.send('API Running'));

// Define Routes (We'll add specific routes later)
// app.use('/api/v1/auth', require('./routes/auth'));
// app.use('/api/v1/users', require('./routes/users'));
// ... etc
app.get('/', (req, res) => res.send('API Running')); // Keep basic test route
app.use('/api/v1/auth', authRoutes); // Use auth routes


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