const express = require('express');
const {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser
} = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', isAuthenticated, logoutUser);
router.get('/me', isAuthenticated, getCurrentUser);

module.exports = router;
