const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validateRegistration } = require('../middleware/validate');

router.post('/register', validateRegistration, register);
router.post('/login', login);
router.get('/profile', protect, getProfile);

module.exports = router;