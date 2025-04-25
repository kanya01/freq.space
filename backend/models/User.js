const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address.'],
        index: true
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long'],
        index: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    profile: {
        firstName: { type: String, trim: true, default: '' },
        lastName: { type: String, trim: true, default: '' },
        bio: { type: String, maxLength: 500, default: '' },
        location: {
            city: { type: String, trim: true, default: '', index: true },
            country: { type: String, trim: true, default: '', index: true },
        },
        // NEW: User type field for onboarding
        userType: {
            type: String,
            enum: ['Artist', 'Producer', 'Engineer', 'Songwriter', 'Vocalist', 'Session Musician', 'Video Producer', null],
            default: null
        },
        // EXISTING: Experience level field
        experienceLevel: {
            type: String,
            enum: ['Hobbyist', 'Part-time', 'Pro', 'Maestro', null],
            default: null
        },
        // EXISTING: Skills field
        skills: { type: [String], default: [], index: true },
        socialLinks: { type: Map, of: String, default: {} },
        avatarUrl: { type: String, default: '' },
        // NEW: Onboarding tracking fields
        onboardingCompleted: {
            type: Boolean,
            default: false
        },
        onboardingStep: {
            type: Number,
            default: 0
        },
        // NEW: Portfolio field for work samples
        portfolio: [{
            title: { type: String, required: true },
            description: { type: String },
            mediaUrl: { type: String, required: true },
            mediaType: {
                type: String,
                enum: ['audio', 'video', 'image'],
                required: true
            },
            thumbnailUrl: { type: String },
            createdAt: { type: Date, default: Date.now }
        }]
    },
    stripeConnect: {
        accountId: { type: String },
        detailsSubmitted: { type: Boolean, default: false }
    },
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

// --- Password Hashing Middleware ---
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// --- Password Comparison Method ---
userSchema.methods.comparePassword = async function(candidatePassword) {
    const user = await this.constructor.findOne({ _id: this._id }).select('+password');
    if (!user) return false;
    return await bcrypt.compare(candidatePassword, user.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;