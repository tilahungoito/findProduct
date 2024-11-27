
//server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import connectDB from './config/db.js';
import productRoutes from './routes/product.routes.js';
import authRoutes from './routes/auth.routes.js';
import path from 'path';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();
// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize()); // Initialize Passport

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', authRoutes); // Add authentication routes
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
}
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
