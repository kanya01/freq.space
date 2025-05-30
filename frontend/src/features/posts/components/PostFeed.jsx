import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchPosts,
    selectPosts,
    selectPostsLoading,
    selectPostsPagination,
    selectPostsError
} from '../postsSlice';
import { selectUser } from '../../auth/authSlice';
import PostForm from './PostForm';
import PostItem from './PostItem';

const PostFeed = ({ userId = null, showPostForm = true }) => {
    const dispatch = useDispatch();
    const posts = useSelector(selectPosts);
    const isLoading = useSelector(selectPostsLoading);
    const error = useSelector(selectPostsError);
    const { currentPage, totalPages } = useSelector(selectPostsPagination);
    const currentUser = useSelector(selectUser);
    const [isFormVisible, setIsFormVisible] = useState(false);

    // Check if we should show the form based on props and auth
    useEffect(() => {
        // Make form visible if showPostForm is true and user is logged in
        setIsFormVisible(showPostForm && !!currentUser);
    }, [showPostForm, currentUser]);

    // Initial load
    useEffect(() => {
        dispatch(fetchPosts({ userId }));
    }, [dispatch, userId]);

    // Handle loading more posts
    const handleLoadMore = () => {
        if (currentPage < totalPages && !isLoading) {
            dispatch(fetchPosts({
                page: currentPage + 1,
                userId
            }));
        }
    };

    // Handle post success - explicitly refetch posts
    const handlePostSuccess = (newPost) => {
        console.log('Post created successfully, refreshing feed', newPost);
        // Explicitly refetch the first page to ensure UI is up to date
        dispatch(fetchPosts({
            page: 1,
            userId
        }));
    };

    return (
        <div className="post-feed">
            {/* Post form - only show if we determined it should be visible */}
            {isFormVisible && (
                <PostForm onSuccess={handlePostSuccess} />
            )}

            {/* Error message */}
            {error && (
                <div className="mb-4 p-3 bg-red-900/50 rounded-md">
                    <p className="text-red-200 text-sm">{error}</p>
                </div>
            )}

            {/* Loading state for initial load */}
            {isLoading && posts.length === 0 && (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
            )}

            {/* No posts message */}
            {!isLoading && posts.length === 0 && (
                <div className="bg-gray-900/50 rounded-lg p-8 text-center">
                    <p className="text-gray-400">
                        {userId ? 'This user hasn\'t posted anything yet.' : 'No posts found.'}
                    </p>
                </div>
            )}

            {/* Posts list */}
            {posts.length > 0 && (
                <div className="space-y-6">
                    {posts.map(post => (
                        <PostItem key={post._id} post={post} />
                    ))}
                </div>
            )}

            {/* Load more button */}
            {posts.length > 0 && currentPage < totalPages && (
                <div className="mt-6 text-center">
                    <button
                        onClick={handleLoadMore}
                        disabled={isLoading}
                        className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
                    >
                        {isLoading ? 'Loading...' : 'Load More'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default PostFeed;