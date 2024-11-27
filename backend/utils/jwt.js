import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js'; // Your User model
import { generateToken } from './jwt.js';

const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });

        const token = generateToken(user);

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
});

export default router;
