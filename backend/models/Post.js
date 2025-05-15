// backend/models/Post.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        maxLength: 3000
    },
    media: [{
        type: {
            type: String,
            enum: ['image', 'audio', 'video'],
            required: true
        },
        url: {
            type: String,
            required: true
        },
        thumbnail: {
            type: String,
            default: ''
        }
    }],
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
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    isPublic: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Add indexes for efficient querying
postSchema.index({ user: 1, createdAt: -1 });
postSchema.index({ 'likes': 1 });
postSchema.index({ createdAt: -1 });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;