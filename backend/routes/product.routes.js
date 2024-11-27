import express from 'express';
import { createProduct, getProducts, updateProduct, deleteProduct } from '../controllers/product.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public Routes
router.get('/', getProducts); // View all products without authentication

// Protected Routes
router.post('/', authenticate, createProduct); // Only logged-in users can add products
router.put('/:id', authenticate, updateProduct); // Only logged-in users can update
router.delete('/:id', authenticate, deleteProduct); // Only logged-in users can delete

export default router;
