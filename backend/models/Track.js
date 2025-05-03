// backend/models/Track.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
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
        type: Number,  // Position in seconds within the track
        required: true,
        min: 0
    }
}, { timestamps: true });

const trackSchema = new Schema({
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
    genre: {
        type: String,
        trim: true
    },
    trackUrl: {
        type: String,
        required: true
    },
    coverUrl: {
        type: String,
        default: ''
    },
    waveformData: {
        type: String, // Path to the JSON waveform data file
        default: ''
    },
    duration: {
        type: Number,  // Duration in seconds
        default: 0
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    plays: {
        type: Number,
        default: 0
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [commentSchema],
    tags: [String]
}, { timestamps: true });

// Add indexes for efficient querying
trackSchema.index({ user: 1, createdAt: -1 });
trackSchema.index({ isPublic: 1, createdAt: -1 });
trackSchema.index({ genre: 1 });
trackSchema.index({ tags: 1 });

const Track = mongoose.model('Track', trackSchema);

module.exports = Track;