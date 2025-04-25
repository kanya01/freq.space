// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true, match: [/\S+@\S+\.\S+/, 'Please use a valid email address.'], index: true },
    username: { type: String, required: [true, 'Username is required'], unique: true, trim: true, minlength: [3, 'Username must be at least 3 characters long'], index: true },
    password: { type: String, required: [true, 'Password is required'], minlength: [6, 'Password must be at least 6 characters long'], select: false }, // select: false hides it by default
    emailVerified: { type: Boolean, default: false },
    profile: {
        firstName: { type: String, trim: true, default: '' },
        lastName: { type: String, trim: true, default: '' },
        bio: { type: String, maxLength: 500, default: '' },
        location: {
            city: { type: String, trim: true, default: '', index: true },
            country: { type: String, trim: true, default: '', index: true },
        },
        experienceLevel: { type: String, enum: ['Hobbyist', 'Part-time', 'Pro', 'Maestro', null], default: null }, // Allow null if not set during onboarding
        skills: { type: [String], default: [], index: true },
        socialLinks: { type: Map, of: String, default: {} },
        avatarUrl: { type: String, default: '' }
    },
    stripeConnect: {
        accountId: { type: String },
        detailsSubmitted: { type: Boolean, default: false }
    },
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

// --- Password Hashing Middleware ---
// Hash password before saving a new user
userSchema.pre('save', async function(next) {
    // Only run this function if password was actually modified (or is new)
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10); // Generate salt
        this.password = await bcrypt.hash(this.password, salt); // Hash password
        next();
    } catch (error) {
        next(error); // Pass error to next middleware/handler
    }
});

// --- Password Comparison Method ---
// Method to compare candidate password with the hashed password in the DB
userSchema.methods.comparePassword = async function(candidatePassword) {
    // 'this.password' refers to the password field of the specific user document
    // We need to explicitly select it if it was hidden with 'select: false'
    const user = await this.constructor.findOne({ _id: this._id }).select('+password');
    if (!user) return false; // Should not happen if method is called on existing user, but safety check
    return await bcrypt.compare(candidatePassword, user.password);
};


const User = mongoose.model('User', userSchema);

module.exports = User;