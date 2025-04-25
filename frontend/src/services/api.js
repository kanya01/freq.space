// frontend/src/services/api.js
import axios from 'axios';
// import { store } from '../app/store'; // Import the Redux store

const api = axios.create({
    // Base URL can be set here if all API calls share a prefix,
    // but we're using '/api' handled by Vite proxy, so might not be needed.
    // baseURL: '/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the token
api.interceptors.request.use(
    (config) => {
        console.log(`[Axios Interceptor] REQUESTING: ${config.method.toUpperCase()} ${config.url}`);
        let token = null;
        let rawToken = null;
        try {
            // *** Revert to using localStorage ***
            rawToken = localStorage.getItem('freq_user_token');
            if (rawToken) {
                token = JSON.parse(rawToken);
            }
        } catch (e) {
            console.error("[Axios Interceptor] Error reading/parsing token from localStorage:", e);
        }

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            console.log(`[Axios Interceptor] Authorization header SET using token from localStorage for ${config.url}`);
        } else {
            console.log(`[Axios Interceptor] No token found in localStorage for ${config.url}`);
            // Explicitly remove header if no token, just in case
            delete config.headers['Authorization'];
        }
        return config;
    },
    (error) => {
        console.error('[Axios Interceptor] Request Setup Error:', error);
        return Promise.reject(error);
    }
);

// Optional: Add a response interceptor (e.g., to handle 401 errors globally)
api.interceptors.response.use(
    (response) => response, // Simply return response if successful
    async (error) => {
        const originalRequest = error.config;
        // Check for 401 Unauthorized error
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Mark request to prevent infinite loops
            console.error('Axios Interceptor: Received 401');
            // Option 1: Just reject, let components/thunks handle it (simpler)
            // Option 2: Try to refresh token here (more complex, requires refresh token logic)
            // Option 3: Dispatch logout action globally (can be disruptive)
            // store.dispatch(logout()); // Example: force logout on 401
            // window.location.href = '/login'; // Force redirect
            // For now, let's just reject it and let the thunk handle logout via loadUser failure
        }
        return Promise.reject(error);
    }
);


export default api; // Export the configured instance