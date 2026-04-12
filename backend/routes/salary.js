import express from "express";
import { addSalary, getSalary } from "../controllers/salaryController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/salary/add
 * @desc    Creates a new salary record for an employee.
 *          Calculates net salary based on basic, allowances, and deductions.
 * @access  Private (Admin only)
 */
router.post("/add", authMiddleware, addSalary);

/**
 * @route   GET /api/salary/employee/:id
 * @desc    Retrieves the salary history for a specific employee.
 *          The ID can be an Employee ID or a User ID.
 * @access  Private
 */
router.get("/employee/:id", authMiddleware, getSalary);

export default router;
