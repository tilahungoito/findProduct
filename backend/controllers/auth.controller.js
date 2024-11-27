//backend/controllers/auth.controller.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.model.js';

const JWT_SECRET = process.env.JWT_SECRET;

// Google OAuth Configuration
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID, // Your Google Client ID
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Your Google Client Secret
    callbackURL: 'http://localhost:5000/api/users/auth/google/callback', // Ensure this matches the redirect URI in Google Developer Console
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const existingUser = await User.findOne({ email: profile.emails[0].value });
        if (existingUser) {
            const token = jwt.sign({ id: existingUser._id }, JWT_SECRET, { expiresIn: '1h' });
            return done(null, { token });
        }

        // If user doesn't exist, create a new user
        const newUser = new User({
            email: profile.emails[0].value,
            password: '', // You can leave the password empty for Google sign-in
        });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1h' });
        done(null, { token });
    } catch (error) {
        done(error, null);
    }
}));

// Regular Signup Controller
export const signupUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashedPassword });
        res.status(201).json({ message: 'Signup successful' });
    } catch (error) {
        res.status(400).json({ message: 'User already exists' });
    }
};

// Regular Login Controller
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Google OAuth route
export const googleAuth = passport.authenticate('google', {
    scope: ['profile', 'email'],
});

// Google OAuth callback route
export const googleAuthRedirect = (req, res) => {
    // On successful authentication, send the token back to the frontend
    const { token } = req.user;
    res.redirect(`http://localhost:3000?token=${token}`); // Redirect to frontend with token in the URL
};
