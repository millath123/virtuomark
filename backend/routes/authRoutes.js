import express from 'express';
import { loginUser, registerUser, logoutUser } from '../controllers/authController.js';

const router = express.Router();

// Route to handle user/admin login
router.post('/login', loginUser);

// Route to handle user registration
router.post('/register', registerUser);

// Route to handle user logout
router.get('/logout', logoutUser);

export default router;