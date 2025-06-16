import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const initialState = {
    content: [],
    currentContent: null,
    loading: false,
    error: null,
    uploadProgress: 0
};

export const uploadContent = createAsyncThunk(
    'content/upload',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post('/api/v1/content', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    // Dispatch progress update
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const contentSlice = createSlice({
    name: 'content',
    initialState,
    reducers: {
        setUploadProgress: (state, action) => {
            state.uploadProgress = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadContent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadContent.fulfilled, (state, action) => {
                state.loading = false;
                state.content.unshift(action.payload);
                state.uploadProgress = 0;
            })
            .addCase(uploadContent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.uploadProgress = 0;
            });
    }
});

export const { setUploadProgress, clearError } = contentSlice.actions;
export default contentSlice.reducer;