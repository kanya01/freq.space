// frontend/src/features/tracks/components/TimestampComments.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../auth/authSlice';
import { formatDuration } from '../../../utils/formatters';
import { addComment, deleteComment } from '../tracksSlice';
import { TrashIcon } from '@heroicons/react/24/outline';
import api from '../../../services/api';

const TimestampComments = ({ trackId, comments = [], currentTime = 0, onSeek }) => {
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const user = useSelector(selectUser);
    const dispatch = useDispatch();

    // Submit a new comment
    const handleSubmitComment = async (e) => {
        e.preventDefault();

        if (!commentText.trim()) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await api.post(`/api/v1/tracks/${trackId}/comments`, {
                text: commentText.trim(),
                timestamp: currentTime
            });

            dispatch(addComment({ trackId, comments: response.data }));
            setCommentText('');
        } catch (err) {
            setError('Failed to post comment. Please try again.');
            console.error('Error posting comment:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Delete a comment
    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;

        try {
            const response = await api.delete(`/api/v1/tracks/${trackId}/comments/${commentId}`);
            dispatch(deleteComment({ trackId, comments: response.data }));
        } catch (err) {
            console.error('Error deleting comment:', err);
            alert('Failed to delete comment. Please try again.');
        }
    };

    // Group comments by timestamp (rounded to nearest second)
    const groupedComments = comments.reduce((acc, comment) => {
        const roundedTimestamp = Math.floor(comment.timestamp);
        if (!acc[roundedTimestamp]) {
            acc[roundedTimestamp] = [];
        }
        acc[roundedTimestamp].push(comment);
        return acc;
    }, {});

    return (
        <div className="timestamp-comments">
            {/* Comment Form */}
            {user && (
                <form onSubmit={handleSubmitComment} className="mb-6">
                    <div className="flex items-start space-x-2">
                        {/* User avatar */}
                        <div className="flex-shrink-0">
                            {user.profile?.avatarUrl ? (
                                <img
                                    src={user.profile.avatarUrl}
                                    alt={user.username}
                                    className="w-8 h-8 rounded-full"
                                />
                            ) : (
                                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-bold text-white">
                                        {user.username.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Comment input */}
                        <div className="flex-1 min-w-0">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Add a comment at the current timestamp..."
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={isSubmitting}
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs font-mono">
                                    @ {formatDuration(currentTime)}
                                </div>
                            </div>

                            {error && (
                                <p className="mt-1 text-red-500 text-xs">{error}</p>
                            )}
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={isSubmitting || !commentText.trim()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </form>
            )}

            {/* Comments List */}
            <div className="space-y-6">
                {Object.entries(groupedComments)
                    .sort(([timeA], [timeB]) => parseFloat(timeA) - parseFloat(timeB))
                    .map(([timestamp, commentsAtTime]) => (
                        <div key={timestamp} className="comment-group">
                            {/* Timestamp header */}
                            <div
                                className="flex items-center mb-2 text-blue-400 cursor-pointer"
                                onClick={() => onSeek(parseFloat(timestamp))}
                            >
                                <span className="font-mono">{formatDuration(parseFloat(timestamp))}</span>
                                <span className="ml-2 text-xs text-gray-500">
                                    {commentsAtTime.length} comment{commentsAtTime.length !== 1 ? 's' : ''}
                                </span>
                            </div>

                            {/* Comments */}
                            <div className="space-y-4 pl-4 border-l border-gray-700">
                                {commentsAtTime.map((comment) => (
                                    <div key={comment._id} className="flex items-start space-x-3">
                                        {/* Comment author avatar */}
                                        <div className="flex-shrink-0">
                                            {comment.user?.profile?.avatarUrl ? (
                                                <img
                                                    src={comment.user.profile.avatarUrl}
                                                    alt={comment.user.username}
                                                    className="w-8 h-8 rounded-full"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                                                    <span className="text-sm font-bold text-white">
                                                        {comment.user?.username?.charAt(0).toUpperCase() || 'U'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Comment content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <span className="font-medium text-white">
                                                        {comment.user?.username || 'Unknown user'}
                                                    </span>
                                                    <span className="ml-2 text-xs text-gray-500">
                                                        {new Date(comment.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                {/* Delete button (only for own comments) */}
                                                {user && comment.user && comment.user._id === user._id && (
                                                    <button
                                                        onClick={() => handleDeleteComment(comment._id)}
                                                        className="text-gray-400 hover:text-white"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>

                                            <p className="text-gray-300 mt-1">{comment.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                {comments.length === 0 && (
                    <p className="text-center text-gray-500">No comments yet. Be the first to comment!</p>
                )}
            </div>
        </div>
    );
};

export default TimestampComments;