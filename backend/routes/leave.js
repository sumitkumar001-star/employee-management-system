import express from "express";
import { 
    addLeave, 
    getLeaves, 
    getEmployeeLeaves, 
    updateLeaveStatus,
    getLeaveDetail
} from "../controllers/leaveController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/leave/add
 * @desc    Submits a new leave application for an employee.
 * @access  Private
 */
router.post("/add", authMiddleware, addLeave);

/**
 * @route   GET /api/leave
 * @desc    Retrieves all leave applications. Typically used by Admin/HR to oversee requests.
 * @access  Private
 */
router.get("/", authMiddleware, getLeaves);

/**
 * @route   GET /api/leave/:id
 * @desc    Retrieves the full details of a specific leave request by its ID.
 * @access  Private
 */
router.get("/:id", authMiddleware, getLeaveDetail);

/**
 * @route   GET /api/leave/employee/:id
 * @desc    Fetches all leave history for a specific employee using their ID or User ID.
 * @access  Private
 */
router.get("/employee/:id", authMiddleware, getEmployeeLeaves);

/**
 * @route   PUT /api/leave/:id
 * @desc    Updates the status (Approved/Rejected) of a leave application.
 * @access  Private (Admin only)
 */
router.put("/:id", authMiddleware, updateLeaveStatus);

export default router;
