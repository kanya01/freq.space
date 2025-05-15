// backend/config/multer.js - Extended for audio support
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

// Ensure upload directories exist
const createUploadDirs = () => {
    const dirs = [
        'uploads',
        'uploads/avatars',
        'uploads/covers',
        'uploads/portfolio',
        'uploads/tracks',      // New directory for audio tracks
        'uploads/waveforms',    // New directory for waveform data
        'uploads/posts' // New directory for post media
    ];

    dirs.forEach(dir => {
        const dirPath = path.join(__dirname, '..', dir);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            console.log(`Created directory: ${dirPath}`);
        }
    });
};

createUploadDirs();

// Configure storage for different file types
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = path.join(__dirname, '..', 'uploads');

        if (file.fieldname === 'avatar') {
            uploadPath = path.join(uploadPath, 'avatars');
        } else if (file.fieldname === 'coverImage') {
            uploadPath = path.join(uploadPath, 'covers');
        } else if (file.fieldname === 'portfolio') {
            uploadPath = path.join(uploadPath, 'portfolio');
        } else if (file.fieldname === 'track') {
            // New handling for audio tracks
            uploadPath = path.join(uploadPath, 'tracks');
        } else if (file.fieldname === 'trackCover') {
            // Cover art for tracks
            uploadPath = path.join(uploadPath, 'covers');
        }
        else if (file.fieldname.startsWith('media_')) {
            // Media files for posts
            uploadPath = path.join(uploadPath, 'posts');
        }

        console.log(`File destination set to: ${uploadPath} for ${file.fieldname}`);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = crypto.randomBytes(16).toString('hex');
        const finalName = `${Date.now()}-${uniqueSuffix}${path.extname(file.originalname)}`;
        console.log(`Generated filename: ${finalName} for ${file.fieldname}`);
        cb(null, finalName);
    }
});

// File filter for different file types
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'avatar' || file.fieldname === 'coverImage' || file.fieldname === 'trackCover') {
        // Accept images only
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed!'), false);
        }
    } else if (file.fieldname === 'portfolio') {
        // Accept images, audio, and video for portfolio
        const allowedTypes = ['image/', 'audio/', 'video/'];
        if (!allowedTypes.some(type => file.mimetype.startsWith(type))) {
            return cb(new Error('Only image, audio, and video files are allowed!'), false);
        }
    } else if (file.fieldname === 'track') {
        // Accept only audio files for tracks
        const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg', 'audio/flac'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Only MP3, WAV, OGG and FLAC audio files are allowed!'), false);
        }
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // 30MB limit for audio files
    }
});

module.exports = upload;