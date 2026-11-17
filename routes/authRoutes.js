const express = require('express');
const { register, login, refreshToken, getCurrentUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.get('/me', protect, getCurrentUser);

module.exports = router;