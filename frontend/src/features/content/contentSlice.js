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
    // Pass `thunkAPI` to get access to `dispatch`.
    async (uploadData, { dispatch, rejectWithValue }) => {
        try {
            const response = await api.post('/api/v1/content', uploadData, {
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    // Dispatch an action to update progress in the Redux store.
                    // This assumes you have a `setUploadProgress` action in your slice.
                    dispatch(setUploadProgress(progress));
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Upload failed');
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