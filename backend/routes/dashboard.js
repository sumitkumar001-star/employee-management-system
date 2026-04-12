import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import getSummary from "../controllers/dashboardController.js";

const router = express.Router();

/**
 * @route   GET /api/dashboard/summary
 * @desc    Retrieves aggregated statistics for the dashboard (counts, salaries, leaves).
 *          This endpoint is typically used by the Admin dashboard to show an overview.
 * @access  Private (Requires valid JWT token)
 */
router.get("/summary", authMiddleware, getSummary);

export default router;