// backend/config/multer.js
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

// Ensure upload directories exist
const createUploadDirs = () => {
    const dirs = ['uploads', 'uploads/avatars', 'uploads/covers', 'uploads/portfolio'];
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