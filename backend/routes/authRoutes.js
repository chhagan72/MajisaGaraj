const express = require('express');
const router = express.Router();
const { registerUser, loginUser, changePassword } = require('../controllers/authController');

// Map clean sub-routes directly to their controllers
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/change-password', changePassword);

module.exports = router;