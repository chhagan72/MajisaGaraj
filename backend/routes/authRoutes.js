const express = require('express');
const router = express.Router();
const { registerUser, loginUser, verifyOtp, changePassword } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOtp);
router.post('/change-password', changePassword);

module.exports = router;