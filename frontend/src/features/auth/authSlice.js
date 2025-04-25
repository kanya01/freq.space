// frontend/src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

// Initial state
const initialState = {
    user: null,
    token: localStorage.getItem('freq_user_token') || null,
    isAuthenticated: false,
    isLoading: false,
    error: null
};

// Login thunk - gets both token and user data
export const login = createAsyncThunk(
    'auth/login',
    async (userData, thunkAPI) => {
        try {
            const data = await authService.login(userData);
            return data; // Contains both token and user
        } catch (error) {
            const message = error.response?.data?.errors?.[0]?.msg ||
                error.response?.data?.message ||
                error.message ||
                'Login failed';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Register thunk - gets both token and user data
export const register = createAsyncThunk(
    'auth/register',
    async (userData, thunkAPI) => {
        try {
            const data = await authService.register(userData);
            return data; // Contains both token and user
        } catch (error) {
            const message = error.response?.data?.errors?.[0]?.msg ||
                error.response?.data?.message ||
                error.message ||
                'Registration failed';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Load user - only called on app initialization
export const loadUser = createAsyncThunk(
    'auth/loadUser',
    async (_, thunkAPI) => {
        try {
            if (!authService.isLoggedIn()) {
                return thunkAPI.rejectWithValue('No token found');
            }

            const user = await authService.getCurrentUser();
            return user;
        } catch (error) {
            authService.logout(); // Clear invalid token
            return thunkAPI.rejectWithValue('Session expired');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            authService.logout();
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Login cases
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.error = action.payload;
            })
            // Register cases
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.error = null;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.error = action.payload;
            })
            // Load user cases
            .addCase(loadUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(loadUser.rejected, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
            });
    }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;