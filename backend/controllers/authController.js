const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Regex compilation validators matching client requests
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// @desc    Register standard users safely (Roles isolated from entry data options)
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email formatting blueprint pattern." });
        }

        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: "Password syntax structure rejected complex requirement criteria verification loops." });
        }

        const normalizedEmail = email.toLowerCase().trim();
        let user = await User.findOne({ email: normalizedEmail });
        if (user) return res.status(400).json({ message: "This email entity address mapping already carries an active profile." });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email: normalizedEmail,
            password: hashedPassword,
            role: 'user' 
        });
        
        await user.save();
        res.status(201).json({ message: "Account deployment successful! Directing connection routing channels..." });
    } catch (err) {
        res.status(500).json({ message: "Internal server execution fault exception error context logged.", error: err.message });
    }
};

// @desc    Authenticate credentials session token structures
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({ email: normalizedEmail });
        if (!user) return res.status(400).json({ message: "Security clearance rejection. Re-verify requested context mapping fields." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Security clearance rejection. Re-verify requested context mapping fields." });

        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '2h' }
        );

        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ message: "Internal server execution fault exception error context logged.", error: err.message });
    }
};

// @desc    Change authenticated user or admin password safely
// @route   POST /api/auth/change-password
exports.changePassword = async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;

        if (!email || !oldPassword || !newPassword) {
            return res.status(400).json({ message: "All authentication fields are mandatory." });
        }

        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({ message: "New password requirements: 8+ characters, 1 uppercase letter, 1 number, and 1 special character." });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(404).json({ message: "Identity node mapping not found." });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password validation failed. Access denied." });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ message: "Security credentials re-calibrated successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Internal server compilation logic error.", error: err.message });
    }
};