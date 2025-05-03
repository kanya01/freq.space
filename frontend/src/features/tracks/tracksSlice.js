// frontend/src/features/tracks/tracksSlice.js
import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import api from '../../services/api';

// Initial state
const initialState = {
    tracks: [],
    currentTrack: null,
    isPlaying: false,
    trackDetails: {},
    loading: false,
    error: null,
    totalTracks: 0,
    currentPage: 1,
    totalPages: 1
};

// Async thunks for API calls
export const fetchTracks = createAsyncThunk(
    'tracks/fetchTracks',
    async ({ page = 1, limit = 10, userId, genre }, thunkAPI) => {
        try {
            let queryParams = `?page=${page}&limit=${limit}`;
            if (userId) queryParams += `&userId=${userId}`;
            if (genre) queryParams += `&genre=${genre}`;

            const response = await api.get(`/api/v1/tracks${queryParams}`);
            return response.data;
        } catch (error) {
            console.error('Fetch tracks error:', error.response?.data || error);
            const message = error.response?.data?.message || error.message || 'Failed to fetch tracks';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const fetchTrackById = createAsyncThunk(
    'tracks/fetchTrackById',
    async ({ id, incrementPlay = false }, thunkAPI) => {
        try {
            const response = await api.get(`/api/v1/tracks/${id}?incrementPlay=${incrementPlay}`);
            return response.data;
        } catch (error) {
            console.error('Fetch track by ID error:', error.response?.data || error);
            const message = error.response?.data?.message || error.message || 'Failed to fetch track';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const uploadTrack = createAsyncThunk(
    'tracks/uploadTrack',
    async (formData, thunkAPI) => {
        try {
            console.log('Uploading track with formData containing:',
                Array.from(formData.entries()).map(([key, value]) =>
                    `${key}: ${value instanceof File ? 'File: ' + value.name : value}`
                )
            );

            // Use the API instance that includes auth headers
            const response = await api.post('/api/v1/tracks', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return response.data;
        } catch (error) {
            console.error('Upload error details:', error.response?.data || error);

            // Better error extraction
            let errorMessage;
            if (error.response?.data?.msg) {
                errorMessage = error.response.data.msg;
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.errors?.[0]?.msg) {
                errorMessage = error.response.data.errors[0].msg;
            } else if (error.message) {
                errorMessage = error.message;
            } else {
                errorMessage = 'Failed to upload track';
            }

            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

export const updateTrackInfo = createAsyncThunk(
    'tracks/updateTrackInfo',
    async ({ id, formData }, thunkAPI) => {
        try {
            const response = await api.put(`/api/v1/tracks/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Update track error:', error.response?.data || error);
            const message = error.response?.data?.message || error.message || 'Failed to update track';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const deleteTrackById = createAsyncThunk(
    'tracks/deleteTrackById',
    async (id, thunkAPI) => {
        try {
            await api.delete(`/api/v1/tracks/${id}`);
            return id;
        } catch (error) {
            console.error('Delete track error:', error.response?.data || error);
            const message = error.response?.data?.message || error.message || 'Failed to delete track';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const likeTrack = createAsyncThunk(
    'tracks/likeTrack',
    async (id, thunkAPI) => {
        try {
            const response = await api.post(`/api/v1/tracks/${id}/like`);
            return { id, likes: response.data };
        } catch (error) {
            console.error('Like track error:', error.response?.data || error);
            const message = error.response?.data?.message || error.message || 'Failed to like track';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const addCommentToTrack = createAsyncThunk(
    'tracks/addCommentToTrack',
    async ({ trackId, text, timestamp }, thunkAPI) => {
        try {
            const response = await api.post(`/api/v1/tracks/${trackId}/comments`, {
                text,
                timestamp
            });
            return { trackId, comments: response.data };
        } catch (error) {
            console.error('Add comment error:', error.response?.data || error);
            const message = error.response?.data?.message || error.message || 'Failed to add comment';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const deleteCommentFromTrack = createAsyncThunk(
    'tracks/deleteCommentFromTrack',
    async ({ trackId, commentId }, thunkAPI) => {
        try {
            const response = await api.delete(`/api/v1/tracks/${trackId}/comments/${commentId}`);
            return { trackId, comments: response.data };
        } catch (error) {
            console.error('Delete comment error:', error.response?.data || error);
            const message = error.response?.data?.message || error.message || 'Failed to delete comment';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Create tracks slice
const tracksSlice = createSlice({
    name: 'tracks',
    initialState,
    reducers: {
        setCurrentTrack: (state, action) => {
            state.currentTrack = action.payload;
        },
        setIsPlaying: (state, action) => {
            state.isPlaying = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        addComment: (state, action) => {
            const { trackId, comments } = action.payload;

            // Update track details if it exists
            if (state.trackDetails[trackId]) {
                state.trackDetails[trackId].comments = comments;
            }

            // Update current track if it matches
            if (state.currentTrack && state.currentTrack._id === trackId) {
                state.currentTrack.comments = comments;
            }

            // Update in tracks list if it exists
            const trackIndex = state.tracks.findIndex(track => track._id === trackId);
            if (trackIndex !== -1) {
                state.tracks[trackIndex].commentCount = comments.length;
            }
        },
        deleteComment: (state, action) => {
            const { trackId, comments } = action.payload;

            // Update track details if it exists
            if (state.trackDetails[trackId]) {
                state.trackDetails[trackId].comments = comments;
            }

            // Update current track if it matches
            if (state.currentTrack && state.currentTrack._id === trackId) {
                state.currentTrack.comments = comments;
            }

            // Update in tracks list if it exists
            const trackIndex = state.tracks.findIndex(track => track._id === trackId);
            if (trackIndex !== -1) {
                state.tracks[trackIndex].commentCount = comments.length;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch tracks
            .addCase(fetchTracks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTracks.fulfilled, (state, action) => {
                state.loading = false;
                state.tracks = action.payload.tracks;
                state.totalTracks = action.payload.total;
                state.currentPage = action.payload.page;
                state.totalPages = action.payload.pages;
            })
            .addCase(fetchTracks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch track by ID
            .addCase(fetchTrackById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTrackById.fulfilled, (state, action) => {
                state.loading = false;
                // Store in trackDetails for later access
                state.trackDetails[action.payload._id] = action.payload;

                // If this is the current track, update it
                if (state.currentTrack && state.currentTrack._id === action.payload._id) {
                    state.currentTrack = action.payload;
                }
            })
            .addCase(fetchTrackById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Upload track
            .addCase(uploadTrack.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadTrack.fulfilled, (state, action) => {
                state.loading = false;
                state.tracks.unshift(action.payload); // Add to beginning of tracks array
                state.totalTracks += 1;
            })
            .addCase(uploadTrack.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update track
            .addCase(updateTrackInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTrackInfo.fulfilled, (state, action) => {
                state.loading = false;

                // Update in trackDetails
                state.trackDetails[action.payload._id] = action.payload;

                // Update in tracks list
                const trackIndex = state.tracks.findIndex(track => track._id === action.payload._id);
                if (trackIndex !== -1) {
                    state.tracks[trackIndex] = {
                        ...state.tracks[trackIndex],
                        ...action.payload
                    };
                }

                // Update current track if it matches
                if (state.currentTrack && state.currentTrack._id === action.payload._id) {
                    state.currentTrack = action.payload;
                }
            })
            .addCase(updateTrackInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete track
            .addCase(deleteTrackById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTrackById.fulfilled, (state, action) => {
                state.loading = false;

                // Remove from tracks list
                state.tracks = state.tracks.filter(track => track._id !== action.payload);

                // Remove from trackDetails
                delete state.trackDetails[action.payload];

                // Reset current track if it matches
                if (state.currentTrack && state.currentTrack._id === action.payload) {
                    state.currentTrack = null;
                    state.isPlaying = false;
                }

                state.totalTracks -= 1;
            })
            .addCase(deleteTrackById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Like track
            .addCase(likeTrack.fulfilled, (state, action) => {
                const { id, likes } = action.payload;

                // Update in trackDetails
                if (state.trackDetails[id]) {
                    state.trackDetails[id].likes = likes;
                }

                // Update in tracks list
                const trackIndex = state.tracks.findIndex(track => track._id === id);
                if (trackIndex !== -1) {
                    state.tracks[trackIndex].likes = likes;
                    state.tracks[trackIndex].likeCount = likes.length;
                }

                // Update current track if it matches
                if (state.currentTrack && state.currentTrack._id === id) {
                    state.currentTrack.likes = likes;
                }
            })

            // Add comment
            .addCase(addCommentToTrack.fulfilled, (state, action) => {
                const { trackId, comments } = action.payload;

                // Update track details if it exists
                if (state.trackDetails[trackId]) {
                    state.trackDetails[trackId].comments = comments;
                }

                // Update current track if it matches
                if (state.currentTrack && state.currentTrack._id === trackId) {
                    state.currentTrack.comments = comments;
                }

                // Update in tracks list if it exists
                const trackIndex = state.tracks.findIndex(track => track._id === trackId);
                if (trackIndex !== -1) {
                    state.tracks[trackIndex].commentCount = comments.length;
                }
            })

            // Delete comment
            .addCase(deleteCommentFromTrack.fulfilled, (state, action) => {
                const { trackId, comments } = action.payload;

                // Update track details if it exists
                if (state.trackDetails[trackId]) {
                    state.trackDetails[trackId].comments = comments;
                }

                // Update current track if it matches
                if (state.currentTrack && state.currentTrack._id === trackId) {
                    state.currentTrack.comments = comments;
                }

                // Update in tracks list if it exists
                const trackIndex = state.tracks.findIndex(track => track._id === trackId);
                if (trackIndex !== -1) {
                    state.tracks[trackIndex].commentCount = comments.length;
                }
            });
    }
});

export const { setCurrentTrack, setIsPlaying, clearError, addComment, deleteComment } = tracksSlice.actions;

// Properly memoized selectors using createSelector
export const selectTracks = (state) => state.tracks.tracks;
export const selectCurrentTrack = (state) => state.tracks.currentTrack;
export const selectIsPlaying = (state) => state.tracks.isPlaying;
export const selectTrackDetails = (state, trackId) => state.tracks.trackDetails[trackId];
export const selectLoading = (state) => state.tracks.loading;
export const selectError = (state) => state.tracks.error;

// Fixed pagination selector with proper memoization
const selectCurrentPage = state => state.tracks.currentPage;
const selectTotalPages = state => state.tracks.totalPages;
const selectTotalTracks = state => state.tracks.totalTracks;

export const selectPagination = createSelector(
    [selectCurrentPage, selectTotalPages, selectTotalTracks],
    (currentPage, totalPages, totalTracks) => ({
        currentPage,
        totalPages,
        totalTracks
    })
);

export default tracksSlice.reducer;