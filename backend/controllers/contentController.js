const Content = require('../models/Content');
const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs').promises;
const sharp = require('sharp'); // For image processing
const ffmpeg = require('fluent-ffmpeg'); // For video processing

// Helper to validate video duration
const getVideoDuration = (filePath) => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) reject(err);
            else resolve(metadata.format.duration);
        });
    });
};

// Helper to get image dimensions
const getImageDimensions = async (filePath) => {
    const metadata = await sharp(filePath).metadata();
    return { width: metadata.width, height: metadata.height };
};

exports.uploadContent = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    try {
        const {title, description, mediaType, tags, isPublic, altText, genre} = req.body;

        if (!req.files || !req.files.media) {
            return res.status(400).json({msg: 'No media file uploaded'});
        }

        const mediaFile = req.files.media[0];
        const mediaUrl = `/uploads/content/${mediaFile.filename}`;

        // Type-specific validation and processing
        let additionalData = {};

        switch (mediaType) {
            case 'video':
                // Check video duration
                const videoDuration = await getVideoDuration(mediaFile.path);
                if (videoDuration > 40) {
                    await fs.unlink(mediaFile.path);
                    return res.status(400).json({msg: 'Video duration must be 40 seconds or less'});
                }
                additionalData.duration = videoDuration;
                break;

            case 'image':
                // Get image dimensions
                const dimensions = await getImageDimensions(mediaFile.path);
                additionalData.dimensions = dimensions;
                if (altText) additionalData.altText = altText;
                break;

            case 'audio':
                // Generate waveform data (using existing logic)
                if (genre) additionalData.genre = genre;
                // Add duration and waveform generation here
                break;
        }

        // Handle cover image if provided
        let coverUrl = '';
        if (req.files.cover && req.files.cover.length > 0) {
            coverUrl = `/uploads/covers/${req.files.cover[0].filename}`;
        }

        // Process tags
        let processedTags = [];
        if (tags) {
            try {
                processedTags = JSON.parse(tags);
            } catch (err) {
                processedTags = tags.split(',').map(tag => tag.trim());
            }
        }

        // Create content
        const content = new Content({
            user: req.user.id,
            title,
            description: description || '',
            mediaType,
            mediaUrl,
            coverUrl,
            tags: processedTags,
            isPublic: isPublic === 'true' || isPublic === true,
            ...additionalData
        });

        await content.save();

        const populatedContent = await Content.findById(content._id)
            .populate('user', 'username profile.avatarUrl');

        res.status(201).json(populatedContent);
    } catch (error) {
        console.error('Upload content error:', error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
};
    // Get all content (public or user's own)
    exports.getAllContent = async (req, res) => {
        try {
            const { page = 1, limit = 10, mediaType, searchQuery, userId } = req.query;
            const query = { isPublic: true };

            if (mediaType) {
                query.mediaType = mediaType;
            }

            if (searchQuery) {
                query.$or = [
                    { title: { $regex: searchQuery, $options: 'i' } },
                    { description: { $regex: searchQuery, $options: 'i' } },
                    { tags: { $in: [new RegExp(searchQuery, 'i')] } }
                ];
            }

            // If a userId is provided, fetch content for that specific user (public or private)
            // Otherwise, fetch all public content or content for the logged-in user
            if (userId) {
                // If the logged-in user is viewing another user's profile
                if (req.user && req.user.id === userId) {
                    // Logged-in user viewing their own profile, show all their content
                    query.user = userId;
                    delete query.isPublic; // Remove isPublic constraint to show private content too
                } else {
                    // Viewing another user's public content
                    query.user = userId;
                    query.isPublic = true;
                }
            } else if (req.user) {
                // Logged-in user browsing general content, show their own (public/private) + others' public
                query.$or = [
                    { user: req.user.id },
                    { isPublic: true }
                ];
                if (query.mediaType) { // Ensure mediaType filter is applied correctly with $or
                    const orConditions = query.$or;
                    delete query.$or;
                    query.$and = [
                        { mediaType: query.mediaType },
                        { $or: orConditions }
                    ];
                }
            }


            const options = {
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
                populate: { path: 'user', select: 'username profile.avatarUrl' },
                sort: { createdAt: -1 }
            };

            const content = await Content.paginate(query, options);
            res.json(content);
        } catch (error) {
            console.error('Get all content error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    };

// Get content by ID
    exports.getContentById = async (req, res) => {
        try {
            const content = await Content.findById(req.params.id)
                .populate('user', 'username profile.avatarUrl');

            if (!content) {
                return res.status(404).json({ msg: 'Content not found' });
            }

            // Check if content is public or if the user is the owner
            if (!content.isPublic && (!req.user || content.user._id.toString() !== req.user.id)) {
                return res.status(403).json({ msg: 'Access denied: Content is private' });
            }

            res.json(content);
        } catch (error) {
            console.error('Get content by ID error:', error);
            if (error.kind === 'ObjectId') {
                return res.status(404).json({ msg: 'Content not found' });
            }
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    };

// Get content by a specific user
    exports.getUserContent = async (req, res) => {
        try {
            const { page = 1, limit = 10, mediaType } = req.query;
            const userId = req.params.userId;

            const query = { user: userId };

            // If the logged-in user is viewing their own content, show private items too
            // Otherwise, only show public content
            if (req.user && req.user.id === userId) {
                // No change to query, will fetch all content for this user
            } else {
                query.isPublic = true;
            }

            if (mediaType) {
                query.mediaType = mediaType;
            }

            const options = {
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
                populate: { path: 'user', select: 'username profile.avatarUrl' },
                sort: { createdAt: -1 }
            };

            const content = await Content.paginate(query, options);
            res.json(content);
        } catch (error) {
            console.error('Get user content error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    };


// Update content
    exports.updateContent = async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            let content = await Content.findById(req.params.id);

            if (!content) {
                return res.status(404).json({ msg: 'Content not found' });
            }

            // Check user
            if (content.user.toString() !== req.user.id) {
                return res.status(401).json({ msg: 'User not authorized' });
            }

            const { title, description, tags, isPublic, altText, genre } = req.body;
            const updatedFields = {};

            if (title) updatedFields.title = title;
            if (description) updatedFields.description = description;
            if (typeof isPublic !== 'undefined') updatedFields.isPublic = isPublic === 'true' || isPublic === true;


            if (tags) {
                try {
                    updatedFields.tags = JSON.parse(tags);
                } catch (err) {
                    updatedFields.tags = tags.split(',').map(tag => tag.trim());
                }
            }

            // Handle media type specific fields
            if (content.mediaType === 'image' && altText) {
                updatedFields.altText = altText;
            }
            if (content.mediaType === 'audio' && genre) {
                updatedFields.genre = genre;
            }

            // Handle cover image update
            if (req.files && req.files.cover && req.files.cover.length > 0) {
                // Delete old cover if it exists
                if (content.coverUrl) {
                    const oldCoverPath = path.join(__dirname, '..', 'public', content.coverUrl);
                    try {
                        await fs.unlink(oldCoverPath);
                    } catch (unlinkError) {
                        console.warn(`Failed to delete old cover image: ${oldCoverPath}`, unlinkError);
                    }
                }
                updatedFields.coverUrl = `/uploads/covers/${req.files.cover[0].filename}`;
            }


            // Note: Media file (video, image, audio) replacement is not handled here.
            // That would typically be a more complex operation, possibly involving deleting the old file
            // and uploading a new one, potentially as a separate endpoint or with more specific logic.

            content = await Content.findByIdAndUpdate(
                req.params.id,
                { $set: updatedFields },
                { new: true }
            ).populate('user', 'username profile.avatarUrl');

            res.json(content);
        } catch (error) {
            console.error('Update content error:', error);
            if (error.kind === 'ObjectId') {
                return res.status(404).json({ msg: 'Content not found' });
            }
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    };

// Delete content
    exports.deleteContent = async (req, res) => {
        try {
            const content = await Content.findById(req.params.id);

            if (!content) {
                return res.status(404).json({ msg: 'Content not found' });
            }

            // Check user
            if (content.user.toString() !== req.user.id) {
                return res.status(401).json({ msg: 'User not authorized' });
            }

            // Delete media file from server
            if (content.mediaUrl) {
                const mediaPath = path.join(__dirname, '..', 'public', content.mediaUrl);
                try {
                    await fs.unlink(mediaPath);
                } catch (unlinkError) {
                    console.warn(`Failed to delete media file: ${mediaPath}`, unlinkError);
                }
            }

            // Delete cover image from server
            if (content.coverUrl) {
                const coverPath = path.join(__dirname, '..', 'public', content.coverUrl);
                try {
                    await fs.unlink(coverPath);
                } catch (unlinkError) {
                    console.warn(`Failed to delete cover image: ${coverPath}`, unlinkError);
                }
            }

            await content.deleteOne(); // Use deleteOne() or remove() based on Mongoose version

            res.json({ msg: 'Content removed' });
        } catch (error) {
            console.error('Delete content error:', error);
            if (error.kind === 'ObjectId') {
                return res.status(404).json({ msg: 'Content not found' });
            }
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    };
// Like or unlike content
exports.likeContent = async (req, res) => {
    try {
        const content = await Content.findById(req.params.id);

        if (!content) {
            return res.status(404).json({ msg: 'Content not found' });
        }

        // Check if the content has already been liked by this user
        if (content.likes.some(like => like.toString() === req.user.id)) {
            // Already liked, so remove the like (unlike)
            content.likes = content.likes.filter(
                like => like.toString() !== req.user.id
            );
        } else {
            // Not liked yet, so add the like
            content.likes.push(req.user.id);
        }

        await content.save();
        const populatedContent = await Content.findById(content._id)
            .populate('user', 'username profile.avatarUrl')
            .populate('comments.user', 'username profile.avatarUrl')
            .populate('likes', 'username profile.avatarUrl'); // Optionally populate likes as well

        res.json(populatedContent);
    } catch (error) {
        console.error('Like content error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Add a comment to content
exports.addComment = async (req, res) => {
    const errors = validationResult(req); // Assuming you might add validation for comments
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const content = await Content.findById(req.params.id);

        if (!content) {
            return res.status(404).json({ msg: 'Content not found' });
        }

        const { text } = req.body;

        if (!text || text.trim() === '') {
            return res.status(400).json({ msg: 'Comment text cannot be empty' });
        }

        const newComment = {
            user: req.user.id,
            text: text,
            createdAt: new Date()
        };

        content.comments.unshift(newComment); // Add to the beginning of the array

        await content.save();
        const populatedContent = await Content.findById(content._id)
            .populate('user', 'username profile.avatarUrl')
            .populate('comments.user', 'username profile.avatarUrl') // Populate user details for comments
            .populate('likes', 'username profile.avatarUrl');

        res.json(populatedContent);
    } catch (error) {
        console.error('Add comment error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
// Add method to get user's content organized by type
exports.getUserPortfolio = async (req, res) => {
    const { userId } = req.params;
    const { mediaType, limit = 50, offset = 0 } = req.query;

    console.log('[ContentController] getUserPortfolio called:', {
        userId,
        mediaType,
        limit,
        offset,
        timestamp: new Date().toISOString()
    });

    try {
        // Build query
        let query = { user: userId };
        if (mediaType) {
            query.mediaType = mediaType;
        }

        console.log('[ContentController] Database query:', query);

        // Execute queries
        const [content, total] = await Promise.all([
            Content.find(query)
                .sort({ createdAt: -1 })
                .limit(parseInt(limit))
                .skip(parseInt(offset))
                .populate('user', 'username profile.avatarUrl'),
            Content.countDocuments(query)
        ]);

        console.log('[ContentController] Database results:', {
            contentFound: content.length,
            totalCount: total
        });

        // Group by media type
        const grouped = {
            images: content.filter(item => item.mediaType === 'image'),
            videos: content.filter(item => item.mediaType === 'video'),
            audio: content.filter(item => item.mediaType === 'audio')
        };

        console.log('[ContentController] Grouped content:', {
            images: grouped.images.length,
            videos: grouped.videos.length,
            audio: grouped.audio.length
        });

        const response = {
            content: grouped,
            total,
            page: Math.floor(offset / limit) + 1,
            pages: Math.ceil(total / limit)
        };

        console.log('[ContentController] Sending response for userId:', userId);
        res.json(response);

    } catch (error) {
        console.error('[ContentController] Error in getUserPortfolio:', {
            error: error.message,
            stack: error.stack,
            userId
        });

        res.status(500).json({
            message: 'Error fetching portfolio content',
            error: error.message
        });
    }
};

// Add featured content support
exports.setFeaturedContent = async (req, res) => {
    try {
        const { contentId } = req.params;
        const { isFeatured } = req.body;

        const content = await Content.findById(contentId);
        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }

        if (content.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        content.isFeatured = isFeatured;
        await content.save();

        res.json(content);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
// Add other controller methods (getContent, getContentById, etc.)
// Similar to the track controller but adapted for the unified content model