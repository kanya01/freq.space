// frontend/src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
// Import reducers later, e.g.:
// import authReducer from '../features/auth/authSlice';

export const store = configureStore({
    reducer: {
        // Add reducers here
         auth: authReducer,
    },
    // Middleware setup is usually automatic with configureStore
    // devTools enable/disable based on NODE_ENV is also automatic
    devTools: process.env.NODE_ENV !== 'production',
});