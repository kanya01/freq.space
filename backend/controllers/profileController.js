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
            .sort({ createdAt: -1 })
            .limit(10);

        if (featuredUsers.length === 0) {
            return res.status(404).json({ message: 'No featured profiles found' });
        }

        res.json(featuredUsers);
    } catch (error) {
        console.error('Get featured profiles error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route   GET api/v1/profile/search
// @desc    Search profiles with filters and pagination
// @access  Public
exports.searchProfiles = async (req, res) => {
    try {
        const {
            q = '',           // search query
            userType,         // filter by user type
            experienceLevel,  // filter by experience level
            city,            // filter by city
            country,         // filter by country
            skills,          // filter by specific skills (comma-separated)
            page = 1,
            limit = 12
        } = req.query;

        // Build search criteria
        const searchCriteria = {
            'profile.onboardingCompleted': true
        };

        // Add filters
        if (userType) {
            searchCriteria['profile.userType'] = userType;
        }

        if (experienceLevel) {
            searchCriteria['profile.experienceLevel'] = experienceLevel;
        }

        if (city) {
            searchCriteria['profile.location.city'] = new RegExp(city, 'i');
        }

        if (country) {
            searchCriteria['profile.location.country'] = new RegExp(country, 'i');
        }

        if (skills) {
            const skillsArray = skills.split(',').map(skill => skill.trim());
            searchCriteria['profile.skills'] = { $in: skillsArray.map(skill => new RegExp(skill, 'i')) };
        }

        // Add text search if query provided
        if (q.trim()) {
            const searchRegex = new RegExp(q.trim(), 'i');
            searchCriteria.$or = [
                { username: searchRegex },
                { 'profile.bio': searchRegex },
                { 'profile.skills': { $in: [searchRegex] } },
                { 'profile.firstName': searchRegex },
                { 'profile.lastName': searchRegex }
            ];
        }

        // Get total count for pagination
        const total = await User.countDocuments(searchCriteria);

        // Execute search with pagination
        const profiles = await User.find(searchCriteria)
            .select('username profile.avatarUrl profile.userType profile.experienceLevel profile.skills profile.location profile.bio profile.firstName profile.lastName')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .lean();

        res.json({
            profiles,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            hasMore: page < Math.ceil(total / limit)
        });

    } catch (error) {
        console.error('Search profiles error:', error);
        res.status(500).json({ message: 'Server error during search' });
    }
};

// @route   GET api/v1/profile/suggestions
// @desc    Get autocomplete suggestions for search
// @access  Public
exports.getSearchSuggestions = async (req, res) => {
    try {
        const { q = '', type = 'all' } = req.query;

        if (!q.trim() || q.length < 2) {
            return res.json({ suggestions: [] });
        }

        const searchRegex = new RegExp(q.trim(), 'i');
        const suggestions = [];

        // Get skill suggestions
        if (type === 'all' || type === 'skills') {
            const skillAggregation = await User.aggregate([
                { $match: { 'profile.onboardingCompleted': true } },
                { $unwind: '$profile.skills' },
                { $match: { 'profile.skills': searchRegex } },
                { $group: { _id: '$profile.skills', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 5 }
            ]);

            suggestions.push(...skillAggregation.map(item => ({
                type: 'skill',
                value: item._id,
                label: item._id,
                count: item.count
            })));
        }

        // Get user type suggestions
        if (type === 'all' || type === 'userTypes') {
            const userTypes = ['Artist', 'Producer', 'Engineer', 'Songwriter', 'Vocalist', 'Session Musician', 'Video Producer'];
            const matchingUserTypes = userTypes.filter(userType =>
                userType.toLowerCase().includes(q.toLowerCase())
            );

            suggestions.push(...matchingUserTypes.map(userType => ({
                type: 'userType',
                value: userType,
                label: userType,
                count: null
            })));
        }

        // Get location suggestions
        if (type === 'all' || type === 'locations') {
            const locationAggregation = await User.aggregate([
                { $match: { 'profile.onboardingCompleted': true } },
                {
                    $match: {
                        $or: [
                            { 'profile.location.city': searchRegex },
                            { 'profile.location.country': searchRegex }
                        ]
                    }
                },
                {
                    $group: {
                        _id: {
                            city: '$profile.location.city',
                            country: '$profile.location.country'
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } },
                { $limit: 3 }
            ]);

            suggestions.push(...locationAggregation.map(item => ({
                type: 'location',
                value: `${item._id.city}, ${item._id.country}`,
                label: `${item._id.city}, ${item._id.country}`,
                count: item.count
            })));
        }

        // Sort suggestions by relevance and count
        suggestions.sort((a, b) => {
            // Exact matches first
            const aExact = a.label.toLowerCase() === q.toLowerCase() ? 1 : 0;
            const bExact = b.label.toLowerCase() === q.toLowerCase() ? 1 : 0;
            if (aExact !== bExact) return bExact - aExact;

            // Then by count (if available)
            if (a.count && b.count) return b.count - a.count;
            return 0;
        });

        res.json({ suggestions: suggestions.slice(0, 8) });

    } catch (error) {
        console.error('Get search suggestions error:', error);
        res.status(500).json({ message: 'Server error getting suggestions' });
    }
};