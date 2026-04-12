import express from 'express';
import { login } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';



const router = express.Router();

/**
 * @route   POST /api/auth/login
 * @desc    Authenticates a user and returns a JWT token.
 * @access  Public
 */
router.post('/login', (req, res, next) => {
    login(req, res).catch(next);
});

/**
 * @route   GET /api/auth/verify
 * @desc    Verifies the validity of the user's JWT token.
 *          This is used by the frontend to maintain session state on page refreshes.
 * @access  Private (Requires valid token in headers)
 */
router.get('/verify', authMiddleware, (req, res) => {
    /**
     * If authMiddleware passes, the user object is already attached to req.user.
     * We simply return the user data to confirm the session is active.
     */
    return res.status(200).json({ success: true, user: req.user });
});

export default router;
