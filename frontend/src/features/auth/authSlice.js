// frontend/src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

// Get token from localStorage
const storedToken = JSON.parse(localStorage.getItem('freq_user_token'));

const initialState = {
    user: null, // Will hold user data object if logged in
    token: storedToken ? storedToken : null,
    isAuthenticated: !!storedToken, // Check if token exists initially
    isLoading: false,
    isError: false,
    isSuccess: false, // Optional: track success state
    message: '', // Store error messages
};

// Async thunk for registration
export const register = createAsyncThunk(
    'auth/register',
    async (userData, thunkAPI) => {
        try {
            const data = await authService.register(userData);
            // Return data needed for the fulfilled reducer (user and token)
            return data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.errors && // Check for backend validation errors array
                    error.response.data.errors[0] &&
                    error.response.data.errors[0].msg) ||
                error.response?.data?.message || // Check for single message property
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message); // Pass error message to rejected reducer
        }
    }
);

// Async thunk for login
export const login = createAsyncThunk(
    'auth/login',
    async (userData, thunkAPI) => {
        try {
            const data = await authService.login(userData);
            return data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.errors && // Check for backend validation errors array
                    error.response.data.errors[0] &&
                    error.response.data.errors[0].msg) ||
                error.response?.data?.message || // Check for single message property
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Async thunk to get user data (if token exists but user data isn't in state)
export const loadUser = createAsyncThunk(
    'auth/loadUser',
    async (_, thunkAPI) => { // Second argument is thunkAPI
        // *** Get token from Redux state within the thunk ***
        const token = thunkAPI.getState().auth.token;
        console.log("loadUser thunk: Checking token from state:", token ? 'Found' : 'Not Found');

        // If no token exists in state when loadUser is called, reject immediately
        if (!token) {
            console.log("loadUser thunk: No token in state, rejecting.");
            return thunkAPI.rejectWithValue('No token found in state');
        }

        try {
            console.log("loadUser thunk: Token found in state, calling authService.getCurrentUser");
            // Interceptor will try localStorage. If it fails the *first* time after login,
            // the backend sends 401, this catch block handles it by logging out.
            // Subsequent calls (e.g., manual refresh) should work as localStorage updates.
            const data = await authService.getCurrentUser();
            console.log("loadUser thunk: Successfully fetched user data.");
            return data; // Returns user object
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.msg) ||
                error.message ||
                error.toString();
            console.error("loadUser thunk: Error calling getCurrentUser:", message);

            // If the error is specifically a 401 (or related), dispatch logout
            if (error.response?.status === 401 || message.includes('401')) {
                console.log("loadUser thunk: Received 401 or related error, dispatching logout.");
                thunkAPI.dispatch(logout()); // Dispatch logout action directly
            }
            // Still reject the promise so components know it failed
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Logout action (can be a simple reducer as it doesn't involve async calls)
// We'll handle the service call within the reducer or component if needed
// Or just handle it in createSlice `reducers`.

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Reset state function
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
        },
        // Logout reducer
        logout: (state) => {
            authService.logout(); // Clear localStorage
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Register cases
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.message = '';
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true; // Mark success
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.message = 'Registration successful!'; // Optional success message
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload; // Error message from rejectWithValue
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
            })
            // Login cases
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.message = '';
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.message = 'Login successful!'; // Optional success message
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
            })
            // Load User cases
            .addCase(loadUser.pending, (state) => {
                // Optional: set loading state if you want UI feedback for this
                // state.isLoading = true;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                // state.isLoading = false;
                // state.isSuccess = true; // Not usually needed for loadUser
                state.isAuthenticated = true; // Ensure authenticated if load succeeds
                state.user = action.payload; // Set user data
            })
            .addCase(loadUser.rejected, (state, action) => {
                // state.isLoading = false;
                // state.isError = true; // Error state might be set by the logout dispatch
                // state.message = action.payload; // Error message
                // State is cleared by the logout action dispatched within the thunk
            });
    },
});

// Export actions (logout, reset) and the reducer
export const { reset, logout } = authSlice.actions;
export default authSlice.reducer;

// Optional: Export selectors for convenience
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.isError ? state.auth.message : null;
export const selectToken = (state) => state.auth.token;