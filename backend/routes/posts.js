// backend/routes/posts.js (IMPORTANT: correct the path)

// Change this to match your other route files
// backend/routes/posts.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { authenticateToken } = require('../middleware/authMiddleware');
const upload = require('../config/multer');
const { body } = require('express-validator');

// Validation middleware
const postValidation = [
    body('content', 'Content is required').not().isEmpty().trim(),
    body('isPublic').optional()
];

const commentValidation = [
    body('text', 'Text is required').not().isEmpty().trim()
];
// Route for testing file uploads - for debugging only
router.use((req, res, next) => {
    console.log(`Post Route Request: ${req.method} ${req.originalUrl}`);
    console.log('Headers:', req.headers['content-type']);
    next();
});

// Create post
router.post('/',
    authenticateToken,
    upload.array('media', 5), // Allow up to 5 media files
    postValidation,
    postController.createPost
);

// Get all posts
router.get('/', postController.getPosts);

// Get post by ID
router.get('/:id', postController.getPostById);

// Update a post
router.put('/:id',
    authenticateToken,
    upload.array('media', 5),
    postValidation,
    postController.updatePost
);

// Delete a post
router.delete('/:id',
    authenticateToken,
    postController.deletePost
);

// Like/unlike a post
router.post('/:id/like',
    authenticateToken,
    postController.likePost
);

// Add a comment
router.post('/:id/comment',
    authenticateToken,
    commentValidation,
    postController.addComment
);

// Delete a comment
router.delete('/:id/comment/:comment_id',
    authenticateToken,
    postController.deleteComment
);

module.exports = router;