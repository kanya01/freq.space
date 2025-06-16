const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100
    },
    description: {
        type: String,
        trim: true,
        maxLength: 2000
    },
    mediaType: {
        type: String,
        enum: ['audio', 'video', 'image'],
        required: true
    },
    mediaUrl: {
        type: String,
        required: true
    },
    thumbnailUrl: {
        type: String,
        default: ''
    },
    coverUrl: {
        type: String,
        default: ''
    },
    // Common metadata
    tags: [String],
    isPublic: {
        type: Boolean,
        default: true
    },
    views: {
        type: Number,
        default: 0
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        text: {
            type: String,
            required: true,
            maxLength: 500
        },
        timestamp: {
            type: Number,  // For audio/video timestamp comments
            default: 0
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    // Type-specific fields
    // Audio fields
    genre: {
        type: String,
        default: ''
    },
    duration: {
        type: Number,  // Duration in seconds
        default: 0
    },
    waveformData: {
        type: String,  // Path to waveform JSON
        default: ''
    },
    // Image fields
    dimensions: {
        width: { type: Number, default: 0 },
        height: { type: Number, default: 0 }
    },
    altText: {
        type: String,
        default: ''
    },
    // Video fields
    resolution: {
        type: String,
        default: ''
    }
}, { timestamps: true });

// Indexes
contentSchema.index({ user: 1, createdAt: -1 });
contentSchema.index({ mediaType: 1, isPublic: 1, createdAt: -1 });
contentSchema.index({ tags: 1 });

const Content = mongoose.model('Content', contentSchema);

module.exports = Content;