
import express from 'express';
import { login } from '../controllers/authController.js';
import verifyUser from '../middleware/authMiddleware.js'; // Ensure you import the middleware we fixed!
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Your existing login route
router.post('/login', login);

// ADD THIS NEW ROUTE:
// It uses a GET request, runs the verifyUser middleware, and then sends back the user data
router.get('/verify',authMiddleware, verifyUser, (req, res) => {
    return res.status(200).json({ success: true, user: req.user });
});

export default router;

