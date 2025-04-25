// frontend/src/services/authService.js
import api from './api';

const API_URL = '/api/v1/auth/';

// Login and get user data in one operation
const login = async (userData) => {
    const response = await api.post(API_URL + 'login', userData);

    if (response.data.token) {
        // Store token immediately
        localStorage.setItem('freq_user_token', JSON.stringify(response.data.token));

        // If backend returns user data with login, use it
        if (response.data.user) {
            return response.data;
        }

        // Otherwise, fetch user data in the same flow
        const userResponse = await api.get(API_URL + 'me');
        return {
            token: response.data.token,
            user: userResponse.data
        };
    }

    throw new Error('No token received from server');
};

// Register and optionally get user data in one operation
const register = async (userData) => {
    const response = await api.post(API_URL + 'register', userData);

    if (response.data.token) {
        localStorage.setItem('freq_user_token', JSON.stringify(response.data.token));

        if (response.data.user) {
            return response.data;
        }

        // Fetch user data if not included
        const userResponse = await api.get(API_URL + 'me');
        return {
            token: response.data.token,
            user: userResponse.data
        };
    }

    throw new Error('No token received from server');
};

// Get current user - simplified
const getCurrentUser = async () => {
    return api.get(API_URL + 'me').then(response => response.data);
};

// Logout user
const logout = () => {
    localStorage.removeItem('freq_user_token');
};

// Check if user is logged in
const isLoggedIn = () => {
    const token = localStorage.getItem('freq_user_token');
    return !!token;
};

const authService = {
    register,
    login,
    logout,
    getCurrentUser,
    isLoggedIn
};

export default authService;