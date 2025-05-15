// frontend/src/features/posts/postsSlice.js
import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import api from '../../services/api';

// Initial state
const initialState = {
    posts: [],
    userPosts: {},
    currentPost: null,
    loading: false,
    error: null,
    totalPosts: 0,
    currentPage: 1,
    totalPages: 1
};

// Async thunks for API calls
export const fetchPosts = createAsyncThunk(
    'posts/fetchPosts',
    async ({ page = 1, limit = 10, userId }, thunkAPI) => {
        try {
            let queryParams = `?page=${page}&limit=${limit}`;
            if (userId) queryParams += `&userId=${userId}`;

            const response = await api.get(`/api/v1/posts${queryParams}`);
            return response.data;
        } catch (error) {
            console.error('Fetch posts error:', error.response?.data || error);
            const message = error.response?.data?.message || error.message || 'Failed to fetch posts';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const fetchPostById = createAsyncThunk(
    'posts/fetchPostById',
    async (id, thunkAPI) => {
        try {
            const response = await api.get(`/api/v1/posts/${id}`);
            return response.data;
        } catch (error) {
            console.error('Fetch post by ID error:', error.response?.data || error);
            const message = error.response?.data?.message || error.message || 'Failed to fetch post';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const createPost = createAsyncThunk(
    'posts/createPost',
    async (formData, thunkAPI) => {
        try {
            const response = await api.post('/api/v1/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Create post error:', error.response?.data || error);
            const message = error.response?.data?.message || error.message || 'Failed to create post';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const updatePost = createAsyncThunk(
    'posts/updatePost',
    async ({ id, formData }, thunkAPI) => {
        try {
            const response = await api.put(`/api/v1/posts/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Update post error:', error.response?.data || error);
            const message = error.response?.data?.message || error.message || 'Failed to update post';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const deletePost = createAsyncThunk(
    'posts/deletePost',
    async (id, thunkAPI) => {
        try {
            await api.delete(`/api/v1/posts/${id}`);
            return id;
        } catch (error) {
            console.error('Delete post error:', error.response?.data || error);
            const message = error.response?.data?.message || error.message || 'Failed to delete post';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const likePost = createAsyncThunk(
    'posts/likePost',
    async (id, thunkAPI) => {
        try {
            const response = await api.post(`/api/v1/posts/${id}/like`);
            return { id, likes: response.data };
        } catch (error) {
            console.error('Like post error:', error.response?.data || error);
            const message = error.response?.data?.message || error.message || 'Failed to like post';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const addComment = createAsyncThunk(
    'posts/addComment',
    async ({ postId, text }, thunkAPI) => {
        try {
            const response = await api.post(`/api/v1/posts/${postId}/comment`, { text });
            return { postId, comments: response.data };
        } catch (error) {
            console.error('Add comment error:', error.response?.data || error);
            const message = error.response?.data?.message || error.message || 'Failed to add comment';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const deleteComment = createAsyncThunk(
    'posts/deleteComment',
    async ({ postId, commentId }, thunkAPI) => {
        try {
            const response = await api.delete(`/api/v1/posts/${postId}/comment/${commentId}`);
            return { postId, comments: response.data };
        } catch (error) {
            console.error('Delete comment error:', error.response?.data || error);
            const message = error.response?.data?.message || error.message || 'Failed to delete comment';
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Create posts slice
const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        clearPostsError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch posts
            .addCase(fetchPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload.posts;
                state.totalPosts = action.payload.total;
                state.currentPage = action.payload.page;
                state.totalPages = action.payload.pages;

                // Also store by user ID for faster access
                action.payload.posts.forEach(post => {
                    if (post.user && post.user._id) {
                        if (!state.userPosts[post.user._id]) {
                            state.userPosts[post.user._id] = [];
                        }

                        // Avoid duplication
                        const existingIndex = state.userPosts[post.user._id].findIndex(p => p._id === post._id);
                        if (existingIndex !== -1) {
                            state.userPosts[post.user._id][existingIndex] = post;
                        } else {
                            state.userPosts[post.user._id].push(post);
                        }
                    }
                });
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create post
            .addCase(createPost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.loading = false;
                state.posts.unshift(action.payload);

                // Also update user posts
                if (action.payload.user && action.payload.user._id) {
                    if (!state.userPosts[action.payload.user._id]) {
                        state.userPosts[action.payload.user._id] = [];
                    }
                    state.userPosts[action.payload.user._id].unshift(action.payload);
                }

                state.totalPosts += 1;
            })
            .addCase(createPost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add more cases for other async thunks...

            // Delete post
            .addCase(deletePost.fulfilled, (state, action) => {
                const postId = action.payload;

                // Find the post to get the user ID
                const post = state.posts.find(p => p._id === postId);
                const userId = post?.user?._id;

                // Remove from posts array
                state.posts = state.posts.filter(post => post._id !== postId);

                // Also remove from userPosts if it exists
                if (userId && state.userPosts[userId]) {
                    state.userPosts[userId] = state.userPosts[userId].filter(post => post._id !== postId);
                }

                state.totalPosts -= 1;
            })

            // Like/unlike post
            .addCase(likePost.fulfilled, (state, action) => {
                const { id, likes } = action.payload;

                // Update in main posts array
                const postIndex = state.posts.findIndex(post => post._id === id);
                if (postIndex !== -1) {
                    state.posts[postIndex].likes = likes;
                }

                // Update in userPosts
                Object.keys(state.userPosts).forEach(userId => {
                    const userPostIndex = state.userPosts[userId].findIndex(post => post._id === id);
                    if (userPostIndex !== -1) {
                        state.userPosts[userId][userPostIndex].likes = likes;
                    }
                });
            })
    }
});

export const { clearPostsError } = postsSlice.actions;

// Selectors
export const selectPosts = (state) => state.posts.posts;
export const selectUserPosts = (state, userId) => state.posts.userPosts[userId] || [];
export const selectPostsLoading = (state) => state.posts.loading;
export const selectPostsError = (state) => state.posts.error;
export const selectPostsPagination = createSelector(
    state => state.posts.currentPage,
    state => state.posts.totalPages,
    state => state.posts.totalPosts,
    (currentPage, totalPages, totalPosts) => ({
        currentPage,
        totalPages,
        totalPosts
    })
);

export default postsSlice.reducer;