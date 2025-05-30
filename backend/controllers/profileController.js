const User = require('../models/User');
const fs = require('fs').promises;
const path = require('path');

// Get public profile by username
exports.getPublicProfile = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username })
            .select('-password -email -stripeConnect')
            .populate('followers', 'username profile.avatarUrl')
            .populate('following', 'username profile.avatarUrl');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Get public profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, bio, location, socialLinks, skills } = req.body;

        //Parse JSON strings from FormData
        const parsedLocation = location ? JSON.parse(location) : {};
        const parsedSocialLinks = socialLinks ? JSON.parse(socialLinks) : {};
        const parsedSkills = skills ? JSON.parse(skills) : [];

        const updateData = {
            'profile.firstName': firstName,
            'profile.lastName': lastName,
            'profile.bio': bio,
            'profile.location': parsedLocation,
            'profile.skills': parsedSkills,
            'profile.socialLinks': parsedSocialLinks
        };

        // Handle file uploads if present
        if (req.files) {
            if (req.files.avatar && req.files.avatar.length > 0) {
                const avatarPath = `/uploads/avatars/${req.files.avatar[0].filename}`;
                console.log('Setting avatar URL to:', avatarPath);
                updateData['profile.avatarUrl'] = avatarPath;
            }

            if (req.files.coverImage && req.files.coverImage.length > 0) {
                const coverPath = `/uploads/covers/${req.files.coverImage[0].filename}`;
                console.log('Setting cover image URL to:', coverPath);
                updateData['profile.coverImageUrl'] = coverPath;
            }
        }

        console.log('Updating user with data:', updateData);

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateData },
            { new: true }
        ).select('-password');

        res.json(user);
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Add portfolio item
exports.addPortfolioItem = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const portfolioItem = {
            title,
            description,
            mediaUrl: `/uploads/portfolio/${req.file.filename}`,
            mediaType: req.file.mimetype.startsWith('image/') ? 'image' :
                req.file.mimetype.startsWith('audio/') ? 'audio' : 'video',
            thumbnailUrl: req.file.mimetype.startsWith('image/') ?
                `/uploads/portfolio/${req.file.filename}` : null
        };

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $push: { 'profile.portfolio': portfolioItem } },
            { new: true }
        ).select('-password');

        res.json(user);
    } catch (error) {
        console.error('Add portfolio item error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete portfolio item
exports.deletePortfolioItem = async (req, res) => {
    try {
        const { itemId } = req.params;

        const user = await User.findById(req.user.id);
        const portfolioItem = user.profile.portfolio.id(itemId);

        if (!portfolioItem) {
            return res.status(404).json({ message: 'Portfolio item not found' });
        }

        // Delete file from filesystem
        const filePath = path.join(__dirname, '..', portfolioItem.mediaUrl);
        await fs.unlink(filePath).catch(console.error);

        user.profile.portfolio.pull(itemId);
        await user.save();

        res.json(user);
    } catch (error) {
        console.error('Delete portfolio item error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getFeaturedProfiles = async (req, res) => {
    try {
        const featuredUsers = await User.find({
            'profile.onboardingCompleted': true,
            'profile.userType': { $exists: true, $ne: null }
        })
            .select('username profile.avatarUrl profile.userType profile.experienceLevel profile.skills')
            // .sort({ createdAt: -1 })
            .limit(10);

        // if (featuredUsers.length === 0) {
        //     return res.status(404).json({ message: 'No featured profiles found' });
        // }

        res.json(featuredUsers);
    } catch (error) {
        console.error('Get featured profiles error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};