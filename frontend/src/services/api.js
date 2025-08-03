// frontend/src/services/api.js
import axios from 'axios';

const api = axios.create({
    // headers: {
    //     'Content-Type': 'application/json',
    // },
    // baseURL: window.PORT || process.env.PORT || 'http://localhost:5001',
    //BREAKING CHANGE: Use relative URL for local development
    //CONTENT UPLOAD WORKS WITHOUT SETTING BASE URL?
});

// Request interceptor for adding auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('freq_user_token');

        if (token) {
            try {
                const parsedToken = JSON.parse(token);
                config.headers.Authorization = `Bearer ${parsedToken}`;
            } catch (e) {
                console.error('Error parsing token:', e);
                localStorage.removeItem('freq_user_token');
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token is invalid - clear it and redirect to login
            localStorage.removeItem('freq_user_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;