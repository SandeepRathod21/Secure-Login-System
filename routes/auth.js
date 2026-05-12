const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

router.post('/register', [
body('username').trim().isLength({ min: 3 }),
body('email').isEmail().normalizeEmail(),
body('password').isLength({ min: 6 })
], async (req, res) => {
const errors = validationResult(req);
if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
}
try {
    const { username, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const secret = speakeasy.generateSecret({ name: `SecureLogin:${email}` });

    user = new User({
    username, email,
    password: hashedPassword,
    twoFactorSecret: secret.base32,
    twoFactorEnabled: true
    });
    await user.save();

    const qrCode = await qrcode.toDataURL(secret.otpauth_url);
    res.status(201).json({ message: 'User registered', qrCode });
} catch (err) {
    res.status(500).json({ message: 'Server error' });
}
});

router.post('/login', async (req, res) => {
try {
    const { email, password, token } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: 'base32',
    token
    });
    if (!verified) return res.status(400).json({ message: 'Invalid 2FA code' });

    const jwtToken = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
    );
    res.json({ token: jwtToken, username: user.username });
} catch (err) {
    res.status(500).json({ message: 'Server error' });
}
});

router.get('/me', authMiddleware, async (req, res) => {
try {
    const user = await User.findById(req.user.id).select('-password -twoFactorSecret');
    res.json(user);
} catch (err) {
    res.status(500).json({ message: 'Server error' });
}
});

module.exports = router;