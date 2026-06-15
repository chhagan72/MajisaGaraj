const mongoose = require('mongoose');

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const UserSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Name field is required.'],
        trim: true 
    },
    email: { 
        type: String, 
        required: [true, 'Email field is required.'], 
        unique: true,
        lowercase: true,
        trim: true,
        match: [emailRegex, 'Please use a valid email structure (e.g. name12@gmail.com)']
    },
    password: { 
        type: String, 
        required: [true, 'Password field is required.']
    },
    role: { 
        type: String, 
        enum: ['user', 'admin'], 
        default: 'user' 
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        default: null
    },
    otpExpires: {
        type: Date,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);