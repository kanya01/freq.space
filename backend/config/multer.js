const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// Configure storage for different file types
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = 'uploads/';

        if (file.fieldname === 'avatar') {
            uploadPath += 'avatars/';
        } else if (file.fieldname === 'coverImage') {
            uploadPath += 'covers/';
        } else if (file.fieldname === 'portfolio') {
            uploadPath += 'portfolio/';
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = crypto.randomBytes(16).toString('hex');
        cb(null, `${Date.now()}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// File filter for different file types
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'avatar' || file.fieldname === 'coverImage') {
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
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

module.exports = upload;