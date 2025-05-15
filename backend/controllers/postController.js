// backend/controllers/postController.js
const Post = require('../models/Post');
const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs').promises;

// @route   POST api/v1/posts
// @desc    Create a new post
// @access  Private
exports.createPost = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { content, isPublic } = req.body;

        // Handle media files
        const media = [];
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                let mediaType = 'image'; // Default type
                if (file.mimetype.startsWith('audio')) {
                    mediaType = 'audio';
                } else if (file.mimetype.startsWith('video')) {
                    mediaType = 'video';
                }

                media.push({
                    type: mediaType,
                    url: `/uploads/posts/${file.filename}`,
                    thumbnail: mediaType !== 'image' ? '' : `/uploads/posts/${file.filename}`
                });
            });
        }

        const newPost = new Post({
            user: req.user.id,
            content,
            media,
            isPublic: isPublic === 'true' || isPublic === true
        });

        const post = await newPost.save();

        // Populate user data for the response
        const populatedPost = await Post.findById(post._id)
            .populate('user', 'username profile.avatarUrl')
            .populate('comments.user', 'username profile.avatarUrl');

        res.status(201).json(populatedPost);
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Add other controller methods for getPosts, getPostById, updatePost, deletePost, likePost, addComment, deleteComment
// ...

// @route   GET api/v1/posts
// @desc    Get all posts with pagination
// @access  Public
exports.getPosts = async (req, res) => {
    try {
        const { page = 1, limit = 10, userId } = req.query;
        const options = {};

        // Filter by user if userId provided
        if (userId) {
            options.user = userId;
        }

        // Get total count
        const total = await Post.countDocuments(options);

        // Get posts with pagination
        const posts = await Post.find(options)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate('user', 'username profile.avatarUrl profile.userType')
            .populate('comments.user', 'username profile.avatarUrl')
            .lean();

        res.json({
            posts,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error('Get posts error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route   GET api/v1/posts/:id
// @desc    Get post by ID
// @access  Public
exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('user', 'username profile.avatarUrl profile.userType')
            .populate('comments.user', 'username profile.avatarUrl')
            .populate('likes', 'username profile.avatarUrl');

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        res.json(post);
    } catch (error) {
        console.error('Get post by ID error:', error);

        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }

        res.status(500).json({ message: 'Server error' });
    }
};

// @route   PUT api/v1/posts/:id
// @desc    Update a post
// @access  Private (owner only)
exports.updatePost = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        // Check ownership
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        const { content, isPublic } = req.body;

        // Update fields
        if (content) post.content = content;
        if (isPublic !== undefined) post.isPublic = isPublic === 'true' || isPublic === true;

        // Handle media files
        if (req.files && req.files.length > 0) {
            const newMedia = [];
            req.files.forEach(file => {
                let mediaType = 'image'; // Default type
                if (file.mimetype.startsWith('audio')) {
                    mediaType = 'audio';
                } else if (file.mimetype.startsWith('video')) {
                    mediaType = 'video';
                }

                newMedia.push({
                    type: mediaType,
                    url: `/uploads/posts/${file.filename}`,
                    thumbnail: mediaType !== 'image' ? '' : `/uploads/posts/${file.filename}`
                });
            });

            // Append new media to existing media
            post.media = [...post.media, ...newMedia];
        }

        await post.save();

        // Populate user data for the response
        const populatedPost = await Post.findById(post._id)
            .populate('user', 'username profile.avatarUrl')
            .populate('comments.user', 'username profile.avatarUrl');

        res.json(populatedPost);
    } catch (error) {
        console.error('Update post error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route   POST api/v1/posts/:id/like
// @desc    Like/unlike a post
// @access  Private
exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        // Check if already liked
        const likeIndex = post.likes.indexOf(req.user.id);

        if (likeIndex !== -1) {
            // Unlike
            post.likes.splice(likeIndex, 1);
        } else {
            // Like
            post.likes.push(req.user.id);
        }

        await post.save();

        res.json(post.likes);
    } catch (error) {
        console.error('Like post error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route   POST api/v1/posts/:id/comment
// @desc    Add a comment to a post
// @access  Private
exports.addComment = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        const newComment = {
            user: req.user.id,
            text: req.body.text,
            createdAt: Date.now()
        };

        post.comments.unshift(newComment);
        await post.save();

        // Populate user data in the comments
        const populatedPost = await Post.findById(post._id)
            .populate('comments.user', 'username profile.avatarUrl');

        res.json(populatedPost.comments);
    } catch (error) {
        console.error('Add comment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route   DELETE api/v1/posts/:id/comment/:comment_id
// @desc    Delete a comment
// @access  Private (comment owner or post owner)
exports.deleteComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        // Find the comment
        const comment = post.comments.find(comment => comment._id.toString() === req.params.comment_id);

        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found' });
        }

        // Check if user is comment owner or post owner
        if (comment.user.toString() !== req.user.id && post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // Find comment index and remove
        const commentIndex = post.comments.findIndex(comment => comment._id.toString() === req.params.comment_id);
        if (commentIndex !== -1) {
            post.comments.splice(commentIndex, 1);
        }

        await post.save();

        res.json(post.comments);
    } catch (error) {
        console.error('Delete comment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route   DELETE api/v1/posts/:id
// @desc    Delete a post

// @access  Private (owner only)
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        // Check ownership
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // Delete associated media files
        for (const media of post.media) {
            if (media.url) {
                const filePath = path.join(__dirname, '..', media.url);
                await fs.unlink(filePath).catch(err => console.error('Error deleting media file:', err));
            }
            if (media.thumbnail && media.thumbnail !== media.url) {
                const thumbnailPath = path.join(__dirname, '..', media.thumbnail);
                await fs.unlink(thumbnailPath).catch(err => console.error('Error deleting thumbnail:', err));
            }
        }

        await Post.deleteOne({ _id: req.params.id });

        res.json({ msg: 'Post deleted', id: req.params.id });
    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};