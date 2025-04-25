// backend/controllers/onboardingController.js
const User = require('../models/User');

exports.updateUserType = async (req, res) => {
    try {
        const { userType } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                'profile.userType': userType,
                'profile.onboardingStep': 1
            },
            { new: true }
        );
        res.json(user);
    } catch (error) {
        console.error('Update user type error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateExperience = async (req, res) => {
    try {
        const { experienceLevel } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                'profile.experienceLevel': experienceLevel,
                'profile.onboardingStep': 2
            },
            { new: true }
        );
        res.json(user);
    } catch (error) {
        console.error('Update experience error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateSkills = async (req, res) => {
    try {
        const { skills } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                'profile.skills': skills,
                'profile.onboardingStep': 3
            },
            { new: true }
        );
        res.json(user);
    } catch (error) {
        console.error('Update skills error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.completeOnboarding = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                'profile.onboardingCompleted': true,
                'profile.onboardingStep': 4
            },
            { new: true }
        );
        res.json(user);
    } catch (error) {
        console.error('Complete onboarding error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};