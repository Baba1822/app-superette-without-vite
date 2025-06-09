const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser } = require('../controllers/authController');

// Routes d'authentification
router.post('/register', register);
router.post('/login', login);
router.get('/me', getCurrentUser);
router.post('/refresh', require('../controllers/authController').refreshToken);

module.exports = router;
