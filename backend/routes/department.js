import express from "express";
import {
  addDepartment,
  getDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment,
} from "../controllers/departmentController.js";
import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();

/**
 * @route   GET /api/department
 * @desc    Retrieves a list of all departments.
 * @access  Private
 */
router.get("/", authMiddleware, getDepartments);

/**
 * @route   POST /api/department/add
 * @desc    Creates a new department record.
 * @access  Private
 */
router.post("/add", authMiddleware, addDepartment);

/**
 * @route   GET /api/department/:id
 * @desc    Retrieves details of a specific department by its ID.
 * @access  Private
 */
router.get("/:id", authMiddleware, getDepartment);

/**
 * @route   PUT /api/department/:id
 * @desc    Updates the information of an existing department.
 * @access  Private
 */
router.put("/:id", authMiddleware, updateDepartment);

/**
 * @route   DELETE /api/department/:id
 * @desc    Deletes a department and triggers cascade deletion of related employees.
 * @access  Private
 */
router.delete("/:id", authMiddleware, deleteDepartment);

export default router;
