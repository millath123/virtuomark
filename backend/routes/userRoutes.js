import express from 'express';
import { getDashboard, getUsers } from '../controllers/userController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route to get user dashboard (protected route)
router.get('/dashboard', protect, getDashboard);

// Route to get admin dashboard (protected and admin-only route)
router.get('/admin/dashboard', protect, admin, getDashboard);
router.get('/admin/users', protect, admin, getUsers);

export default router;