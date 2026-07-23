const express = require('express');
const router = express.Router();
const { login, register, logout, getCurrentAdmin } = require('../controllers/authController');
const { protectRoute } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protectRoute, logout);
router.get('/me', protectRoute, getCurrentAdmin);

module.exports = router;
