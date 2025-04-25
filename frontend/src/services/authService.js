// frontend/src/services/authService.js
// import axios from 'axios'; // Remove direct axios import
import api from './api'; // Import the configured api instance

const API_URL = '/api/v1/auth/';

// Register user
const register = async (userData) => {
    const response = await api.post(API_URL + 'register', userData); // Use api instance
    // ... (localStorage logic remains the same)
    return response.data;
};

// Login user
const login = async (userData) => {
    const response = await api.post(API_URL + 'login', userData); // Use api instance
    // ... (localStorage logic remains the same)
    return response.data;
};

// Logout user (no API call needed here usually)
const logout = () => {
    localStorage.removeItem('freq_user_token');
};

// Get current user data
const getCurrentUser = async () => {
    console.log("Attempting to call GET /me using configured API instance");
    const response = await api.get(API_URL + 'me'); // Use api instance (auth header is added by interceptor)
    return response.data;
};


const authService = {
    register,
    login,
    logout,
    getCurrentUser,
};

export default authService;