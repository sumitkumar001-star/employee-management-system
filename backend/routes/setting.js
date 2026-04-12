import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { changePassword } from "../controllers/settingController.js";

const router = express.Router();

/**
 * @route   PUT /api/setting/change-password
 * @desc    Updates the authenticated user's password.
 *          Requires the old password for verification before setting the new one.
 * @access  Private
 */
router.put("/change-password", authMiddleware, changePassword);

export default router;
