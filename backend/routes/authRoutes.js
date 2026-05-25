const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Map clean sub-routes directly to their controllers
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;