const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const { authenticateToken } = require('../middleware/authMiddleware');
const upload = require('../config/multer');
const { body } = require('express-validator');

// Validation middleware
const contentValidation = [
    body('title', 'Title is required').not().isEmpty().trim(),
    body('description').optional().trim(),
    body('mediaType', 'Media type is required').isIn(['audio', 'video', 'image']),
    body('tags').optional(),
    body('isPublic').optional().isBoolean()
];

// Upload content
router.post('/',
    authenticateToken,
    upload.fields([
        { name: 'media', maxCount: 1 },
        { name: 'cover', maxCount: 1 }
    ]),
    contentValidation,
    contentController.uploadContent
);

// Get content feed
router.get('/', contentController.getAllContent);

// Get content by ID
router.get('/:id', contentController.getContentById);

// Like content
router.post('/:id/like',
    authenticateToken,
    contentController.likeContent
);

// Add comment
router.post('/:id/comment',
    authenticateToken,
    contentController.addComment
);

// Update content
router.put('/:id',
    authenticateToken,
    upload.fields([{ name: 'cover', maxCount: 1 }]),
    contentController.updateContent
);

// Delete content
router.delete('/:id',
    authenticateToken,
    contentController.deleteContent
);

module.exports = router;