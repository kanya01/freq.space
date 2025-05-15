// frontend/src/features/posts/components/PostItem.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { likePost, addComment, deletePost, deleteComment } from '../postsSlice';
import { selectUser } from '../../auth/authSlice';
import { formatRelativeTime } from '../../../utils/formatters';
import {
    HeartIcon as HeartOutline,
    ChatBubbleLeftIcon,
    TrashIcon,
    PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

const PostItem = ({ post }) => {
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const dispatch = useDispatch();
    const currentUser = useSelector(selectUser);

    // Check if current user has liked the post
    const hasLiked = currentUser && post.likes.some(like => like === currentUser._id || like._id === currentUser._id);

    // Check if current user is the owner
    const isOwner = currentUser && post.user._id === currentUser._id;

    // Handle like
    const handleLike = () => {
        if (!currentUser) return;
        dispatch(likePost(post._id));
    };

    // Handle comment submission
    const handleSubmitComment = async (e) => {
        e.preventDefault();

        if (!commentText.trim() || !currentUser) return;

        setIsSubmittingComment(true);

        try {
            await dispatch(addComment({
                postId: post._id,
                text: commentText.trim()
            }));

            setCommentText('');
            setShowComments(true);
        } catch (err) {
            console.error('Error adding comment:', err);
        } finally {
            setIsSubmittingComment(false);
        }
    };

    // Handle post deletion
    const handleDeletePost = async () => {
        if (showDeleteConfirm) {
            try {
                await dispatch(deletePost(post._id));
            } catch (err) {
                console.error('Error deleting post:', err);
            }
        } else {
            setShowDeleteConfirm(true);
        }
    };

    // Handle comment deletion
    const handleDeleteComment = async (commentId) => {
        try {
            await dispatch(deleteComment({
                postId: post._id,
                commentId
            }));
        } catch (err) {
            console.error('Error deleting comment:', err);
        }
    };

    return (
        <div className="bg-gray-900 rounded-lg overflow-hidden mb-4">
            {/* Post header */}
            <div className="p-4">
                <div className="flex items-center space-x-3">
                    {/* User avatar */}
                    <div className="flex-shrink-0">
                        {post.user?.profile?.avatarUrl ? (
                            <img
                                src={post.user.profile.avatarUrl}
                                alt={post.user.username}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                                <span className="text-gray-400 font-medium">
                                    {post.user?.username?.charAt(0).toUpperCase() || '?'}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* User info and post time */}
                    <div className="flex-1 min-w-0">
                        <p className="text-white font-medium">{post.user?.username || 'Unknown user'}</p>
                        <p className="text-gray-500 text-sm">{formatRelativeTime(post.createdAt)}</p>
                    </div>

                    {/* Delete post button (owner only) */}
                    {isOwner && (
                        <div className="relative">
                            <button
                                onClick={handleDeletePost}
                                className="text-gray-500 hover:text-red-500 p-1"
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>

                            {showDeleteConfirm && (
                                <div className="absolute right-0 top-8 bg-gray-800 p-2 rounded-md shadow-lg z-10 w-40">
                                    <p className="text-sm text-white mb-2">Delete this post?</p>
                                    <div className="flex justify-between">
                                        <button
                                            onClick={() => setShowDeleteConfirm(false)}
                                            className="px-2 py-1 text-xs bg-gray-700 text-white rounded-md"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleDeletePost}
                                            className="px-2 py-1 text-xs bg-red-700 text-white rounded-md"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Post content */}
            <div className="px-4 pb-3">
                <p className="text-white whitespace-pre-wrap break-words mb-3">{post.content}</p>
            </div>

            {/* Media content */}
            {post.media && post.media.length > 0 && (
                <div className={`grid ${post.media.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-1 mb-3`}>
                    {post.media.map((media, index) => (
                        <div key={index} className="aspect-w-16 aspect-h-9 bg-gray-800">
                            {media.type === 'image' ? (
                                <img
                                    src={media.url}
                                    alt="Post media"
                                    className="object-cover w-full h-full"
                                />
                            ) : media.type === 'video' ? (
                                <video
                                    src={media.url}
                                    className="object-cover w-full h-full"
                                    controls
                                />
                            ) : (
                                <div className="flex items-center justify-center">
                                    <audio src={media.url} className="w-full" controls />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Post actions */}
            <div className="px-4 py-2 border-t border-gray-800 flex justify-between">
                <div className="flex space-x-4">
                    {/* Like button */}
                    <button
                        onClick={handleLike}
                        className="flex items-center space-x-1 text-gray-400 hover:text-white"
                    >
                        {hasLiked ? (
                            <HeartSolid className="h-5 w-5 text-red-500" />
                        ) : (
                            <HeartOutline className="h-5 w-5" />
                        )}
                        <span>{post.likes?.length || 0}</span>
                    </button>

                    {/* Comment button */}
                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="flex items-center space-x-1 text-gray-400 hover:text-white"
                    >
                        <ChatBubbleLeftIcon className="h-5 w-5" />
                        <span>{post.comments?.length || 0}</span>
                    </button>
                </div>
            </div>

            {/* Comments section */}
            {showComments && (
                <div className="px-4 py-3 border-t border-gray-800">
                    {/* Comment form */}
                    {currentUser && (
                        <form onSubmit={handleSubmitComment} className="flex space-x-2 mb-4">
                            <div className="flex-shrink-0">
                                {currentUser.profile?.avatarUrl ? (
                                    <img
                                        src={currentUser.profile.avatarUrl}
                                        alt={currentUser.username}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                                        <span className="text-gray-400 text-sm font-medium">
                                            {currentUser.username.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Add a comment..."
                                    className="w-full bg-gray-800 border border-gray-700 rounded-full py-2 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    disabled={isSubmittingComment}
                                />

                                <button
                                    type="submit"
                                    disabled={!commentText.trim() || isSubmittingComment}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-400 disabled:text-gray-600 disabled:cursor-not-allowed"
                                >
                                    <PaperAirplaneIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Comments list */}
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                        {post.comments && post.comments.length > 0 ? (
                            post.comments.map((comment) => (
                                <div key={comment._id} className="flex space-x-2">
                                    {/* Commenter avatar */}
                                    <div className="flex-shrink-0">
                                        {comment.user?.profile?.avatarUrl ? (
                                            <img
                                                src={comment.user.profile.avatarUrl}
                                                alt={comment.user.username}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                                                <span className="text-gray-400 text-sm font-medium">
                                                    {comment.user?.username?.charAt(0).toUpperCase() || '?'}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 bg-gray-800 rounded-lg p-2 relative">
                                        <div className="flex justify-between">
                                            <p className="text-white text-sm font-medium">
                                                {comment.user?.username || 'Unknown user'}
                                            </p>
                                            <p className="text-gray-500 text-xs">
                                                {formatRelativeTime(comment.createdAt)}
                                            </p>
                                        </div>

                                        <p className="text-white text-sm mt-1">{comment.text}</p>

                                        {/* Delete comment button */}
                                        {(currentUser && (currentUser._id === comment.user?._id || isOwner)) && (
                                            <button
                                                onClick={() => handleDeleteComment(comment._id)}
                                                className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                                            >
                                                <TrashIcon className="h-3 w-3" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center text-sm">No comments yet.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostItem;