// backend/routes/onboarding.js
const express = require('express');
const router = express.Router();
const onboardingController = require('../controllers/onboardingController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/user-type', authenticateToken, onboardingController.updateUserType);
router.post('/experience', authenticateToken, onboardingController.updateExperience);
router.post('/skills', authenticateToken, onboardingController.updateSkills);
router.post('/complete', authenticateToken, onboardingController.completeOnboarding);

module.exports = router;