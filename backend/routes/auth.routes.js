//backend/routes/auth.routes.js
import express from 'express';
import passport from 'passport';
import {
    signupUser,
    loginUser,
    googleAuthRedirect,
} from '../controllers/auth.controller.js';
import '../config/passport.js';

const router = express.Router();

// Signup Route
router.post('/signup', signupUser);

// Login Route
router.post('/login', loginUser);

// Google OAuth Routes
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { session: false }), googleAuthRedirect);

export default router;
