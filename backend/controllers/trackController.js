// backend/controllers/trackController.js - modified for single file upload
const Track = require('../models/Track');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs').promises;
const mm = require('music-metadata');

// Simplified waveform data generation (without the AudioContext which might not be available in Node)
const generateWaveformData = async (filePath) => {
    try {
        // For now, just generate a placeholder waveform
        // In production, you'd want to use a dedicated library or service
        const waveformData = [];
        for (let i = 0; i < 100; i++) {
            waveformData.push(Math.random() * 0.8 + 0.1); // Random values between 0.1 and 0.9
        }

        // Save the waveform data to a JSON file
        const waveformFilename = `waveform-${path.basename(filePath, path.extname(filePath))}.json`;
        const waveformPath = path.join(__dirname, '..', 'uploads', 'waveforms', waveformFilename);

        await fs.writeFile(waveformPath, JSON.stringify(waveformData));

        return `/uploads/waveforms/${waveformFilename}`;
    } catch (error) {
        console.error('Error generating waveform data:', error);
        return null;
    }
};

// @route   POST api/v1/tracks
// @desc    Upload a new track
// @access  Private
exports.uploadTrack = async (req, res) => {
    console.log('Upload track controller called');
    console.log('Request file:', req.file);
    console.log('Request body:', req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Verify file was uploaded - using single not fields
        if (!req.file) {
            console.error('No file in request');
            return res.status(400).json({ msg: 'No audio file uploaded' });
        }

        const { title, description, genre, isPublic } = req.body;

        // Get track file info
        const trackFile = req.file;
        const trackUrl = `/uploads/tracks/${trackFile.filename}`;
        const trackPath = path.join(__dirname, '..', trackUrl);

        // Get cover image if provided - we'll handle this separately
        let coverUrl = '';

        // Extract audio metadata
        let duration = 0;
        try {
            const metadata = await mm.parseFile(trackPath);
            duration = metadata.format.duration || 0;
        } catch (err) {
            console.error('Error parsing audio metadata:', err);
        }

        // Generate waveform data
        const waveformData = await generateWaveformData(trackPath);

        // Process tags if provided
        let processedTags = [];
        if (req.body.tags) {
            try {
                processedTags = JSON.parse(req.body.tags);
            } catch (err) {
                console.error('Error parsing tags:', err);
            }
        }

        // Create new track
        const track = new Track({
            user: req.user.id,
            title,
            description: description || '',
            genre: genre || '',
            trackUrl,
            coverUrl,
            waveformData,
            duration,
            isPublic: isPublic === 'true',
            tags: processedTags
        });

        await track.save();

        // Populate user data
        const populatedTrack = await Track.findById(track._id)
            .populate('user', 'username profile.avatarUrl')
            .populate('comments.user', 'username profile.avatarUrl');

        res.status(201).json(populatedTrack);
    } catch (error) {
        console.error('Upload track error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Keep other controller methods unchanged
exports.getTracks = async (req, res) => {
    try {
        const { page = 1, limit = 10, userId, genre } = req.query;
        const options = {
            isPublic: true
        };

        // Filter by user if userId provided
        if (userId) {
            options.user = userId;
        }

        // Filter by genre if provided
        if (genre) {
            options.genre = genre;
        }

        // Get total count
        const total = await Track.countDocuments(options);

        // Get tracks with pagination
        const tracks = await Track.find(options)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate('user', 'username profile.avatarUrl profile.userType')
            .lean();

        // Calculate comment counts
        const tracksWithCommentCounts = tracks.map(track => ({
            ...track,
            commentCount: track.comments ? track.comments.length : 0,
            likeCount: track.likes ? track.likes.length : 0,
            // Remove detailed comments from feed to reduce payload size
            comments: undefined
        }));

        res.json({
            tracks: tracksWithCommentCounts,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error('Get tracks error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route   GET api/v1/tracks/:id
// @desc    Get track by ID with comments
// @access  Public
exports.getTrackById = async (req, res) => {
    try {
        const track = await Track.findById(req.params.id)
            .populate('user', 'username profile.avatarUrl profile.userType')
            .populate('comments.user', 'username profile.avatarUrl')
            .populate('likes', 'username profile.avatarUrl');

        if (!track) {
            return res.status(404).json({ msg: 'Track not found' });
        }

        // Increment play count on access
        if (req.query.incrementPlay === 'true') {
            track.plays += 1;
            await track.save();
        }

        res.json(track);
    } catch (error) {
        console.error('Get track by ID error:', error);

        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Track not found' });
        }

        res.status(500).json({ message: 'Server error' });
    }
};

// @route   POST api/v1/tracks/:id/comments
// @desc    Add comment to track
// @access  Private
exports.addComment = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { text, timestamp } = req.body;

        const track = await Track.findById(req.params.id);

        if (!track) {
            return res.status(404).json({ msg: 'Track not found' });
        }

        // Create new comment
        const newComment = {
            user: req.user.id,
            text,
            timestamp: parseFloat(timestamp) || 0
        };

        // Add to comments array
        track.comments.unshift(newComment);

        await track.save();

        // Populate user data in the comment
        const populatedTrack = await Track.findById(track._id)
            .populate('comments.user', 'username profile.avatarUrl');

        res.json(populatedTrack.comments);
    } catch (error) {
        console.error('Add comment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route   DELETE api/v1/tracks/:id/comments/:commentId
// @desc    Delete comment from track
// @access  Private
exports.deleteComment = async (req, res) => {
    try {
        const track = await Track.findById(req.params.id);

        if (!track) {
            return res.status(404).json({ msg: 'Track not found' });
        }

        // Get the comment
        const comment = track.comments.id(req.params.commentId);

        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found' });
        }

        // Check user is comment owner or track owner
        if (comment.user.toString() !== req.user.id && track.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // Remove the comment
        comment.remove();

        await track.save();

        res.json(track.comments);
    } catch (error) {
        console.error('Delete comment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route   POST api/v1/tracks/:id/like
// @desc    Like a track
// @access  Private
exports.likeTrack = async (req, res) => {
    try {
        const track = await Track.findById(req.params.id);

        if (!track) {
            return res.status(404).json({ msg: 'Track not found' });
        }

        // Check if already liked
        if (track.likes.some(like => like.toString() === req.user.id)) {
            // Remove the like
            track.likes = track.likes.filter(like => like.toString() !== req.user.id);
        } else {
            // Add the like
            track.likes.unshift(req.user.id);
        }

        await track.save();

        res.json(track.likes);
    } catch (error) {
        console.error('Like track error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route   PUT api/v1/tracks/:id
// @desc    Update track info
// @access  Private
exports.updateTrack = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const track = await Track.findById(req.params.id);

        if (!track) {
            return res.status(404).json({ msg: 'Track not found' });
        }

        // Check if user owns the track
        if (track.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        const { title, description, genre, isPublic, tags } = req.body;

        // Update fields if provided
        if (title) track.title = title;
        if (description !== undefined) track.description = description;
        if (genre) track.genre = genre;
        if (isPublic !== undefined) track.isPublic = isPublic === 'true';
        if (tags) {
            try {
                track.tags = JSON.parse(tags);
            } catch (err) {
                console.error('Error parsing tags:', err);
            }
        }

        // If a new cover image was uploaded
        if (req.files && req.files.trackCover && req.files.trackCover[0]) {
            // Delete old cover image if exists
            if (track.coverUrl) {
                const oldCoverPath = path.join(__dirname, '..', track.coverUrl);
                await fs.unlink(oldCoverPath).catch(err => console.error('Error deleting old cover:', err));
            }

            track.coverUrl = `/uploads/covers/${req.files.trackCover[0].filename}`;
        }

        await track.save();

        res.json(track);
    } catch (error) {
        console.error('Update track error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route   DELETE api/v1/tracks/:id
// @desc    Delete a track
// @access  Private
exports.deleteTrack = async (req, res) => {
    try {
        const track = await Track.findById(req.params.id);

        if (!track) {
            return res.status(404).json({ msg: 'Track not found' });
        }

        // Check if user owns the track
        if (track.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // Delete associated files
        if (track.trackUrl) {
            const trackPath = path.join(__dirname, '..', track.trackUrl);
            await fs.unlink(trackPath).catch(err => console.error('Error deleting track file:', err));
        }

        if (track.coverUrl) {
            const coverPath = path.join(__dirname, '..', track.coverUrl);
            await fs.unlink(coverPath).catch(err => console.error('Error deleting cover image:', err));
        }

        if (track.waveformData) {
            const waveformPath = path.join(__dirname, '..', track.waveformData);
            await fs.unlink(waveformPath).catch(err => console.error('Error deleting waveform data:', err));
        }

        await track.remove();

        res.json({ msg: 'Track deleted' });
    } catch (error) {
        console.error('Delete track error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};