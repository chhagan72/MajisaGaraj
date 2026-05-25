const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Regular Expressions matching your strict validation request
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// @desc    Register a new garage profile
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // 1. Structural email regex inspection
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                message: "Format error. Use a proper email address pattern (e.g. chhagan12@gmail.com)." 
            });
        }

        // 2. Strict password complexity verification (8+ chars, 1 uppercase, 1 number, 1 special char)
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ 
                message: "Password verification rejected. It must contain at least 8 characters, 1 uppercase letter, 1 number, and 1 special character (e.g. Chhagan@72)." 
            });
        }

        // Check if user already exists
        let user = await User.findOne({ email: email.toLowerCase() });
        if (user) {
            return res.status(400).json({ message: "An account with this email address already exists." });
        }

        // Password hashing protection
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save entry
        user = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'user'
        });
        await user.save();

        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Authenticate user session & provide token
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by normalized email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials. Identity match failed." });
        }

        // Evaluate security passcode keys
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials. Identity match failed." });
        }

        // Generate JSON Web Token validation session
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.json({ 
            token, 
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email, 
                role: user.role 
            } 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};