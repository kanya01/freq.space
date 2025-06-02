const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authenticateToken } = require('../middleware/authMiddleware');
const upload = require('../config/multer');

router.get('/search', profileController.searchProfiles);
router.get('/suggestions', profileController.getSearchSuggestions);
router.get('/featured', profileController.getFeaturedProfiles);
// Public profile routes
router.get('/:username', profileController.getPublicProfile);

// Protected routes
router.put('/',
    authenticateToken,
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'coverImage', maxCount: 1 }
    ]),
    profileController.updateProfile
);

router.post('/portfolio',
    authenticateToken,
    upload.single('portfolio'),
    profileController.addPortfolioItem
);

router.delete('/portfolio/:itemId',
    authenticateToken,
    profileController.deletePortfolioItem
);



module.exports = router;