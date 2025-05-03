// backend/routes/tracks.js
const express = require('express');
const router = express.Router();
const trackController = require('../controllers/trackController');
const { authenticateToken } = require('../middleware/authMiddleware');
const upload = require('../config/multer');
const { body } = require('express-validator');

// Validation middleware
const trackValidation = [
    body('title', 'Title is required').not().isEmpty().trim(),
    body('description').optional().trim(),
    body('genre').optional().trim(),
    body('isPublic').optional(),
    body('tags').optional()
];

const commentValidation = [
    body('text', 'Text is required').not().isEmpty().trim(),
    body('timestamp', 'Timestamp must be a valid number').isFloat({ min: 0 })
];

// Route for testing file uploads - for debugging only
router.post('/test-upload',
    authenticateToken,
    upload.single('track'),
    (req, res) => {
        console.log('Test upload route hit');
        console.log('Request files:', req.file);
        console.log('Request body:', req.body);

        if (!req.file) {
            return res.status(400).json({ msg: 'No file received in test route' });
        }

        res.json({
            success: true,
            message: 'File received',
            file: req.file
        });
    }
);

// @route   POST api/v1/tracks
// @desc    Upload a new track
// @access  Private
router.post('/',
    authenticateToken,
    // IMPORTANT: Use single for the main track file, not fields
    upload.single('track'),
    trackValidation,
    trackController.uploadTrack
);

// @route   GET api/v1/tracks
// @desc    Get tracks for feed
// @access  Public
router.get('/', trackController.getTracks);

// @route   GET api/v1/tracks/:id
// @desc    Get track by ID with comments
// @access  Public
router.get('/:id', trackController.getTrackById);

// @route   POST api/v1/tracks/:id/comments
// @desc    Add comment to track
// @access  Private
router.post('/:id/comments',
    authenticateToken,
    commentValidation,
    trackController.addComment
);

// @route   DELETE api/v1/tracks/:id/comments/:commentId
// @desc    Delete comment from track
// @access  Private
router.delete('/:id/comments/:commentId',
    authenticateToken,
    trackController.deleteComment
);

// @route   POST api/v1/tracks/:id/like
// @desc    Like a track
// @access  Private
router.post('/:id/like',
    authenticateToken,
    trackController.likeTrack
);

// @route   PUT api/v1/tracks/:id
// @desc    Update track info
// @access  Private
router.put('/:id',
    authenticateToken,
    upload.fields([{ name: 'trackCover', maxCount: 1 }]),
    trackValidation,
    trackController.updateTrack
);

// @route   DELETE api/v1/tracks/:id
// @desc    Delete a track
// @access  Private
router.delete('/:id',
    authenticateToken,
    trackController.deleteTrack
);

module.exports = router;