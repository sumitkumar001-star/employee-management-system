import express from "express";
import { addEmployee, upload, getEmployees, getEmployee , updateEmployee, fetchEmployeesByDepId, deleteEmployee} from "../controllers/employeeController.js";
import authMiddleware from "../middleware/authMiddleware.js";



const router = express.Router();

/**
 * @route   GET /api/employee
 * @desc    Retrieves a list of all employees with populated user and department details.
 * @access  Private
 */
router.get("/", authMiddleware, getEmployees);

/**
 * @route   POST /api/employee/add
 * @desc    Creates a new user and a corresponding employee record.
 *          Handles profile picture upload using Multer middleware.
 * @access  Private
 */
router.post("/add", authMiddleware, upload.single("image"), addEmployee);

/**
 * @route   GET /api/employee/:id
 * @desc    Retrieves details for a specific employee. 
 *          The ID can be either the Employee ID or the linked User ID.
 * @access  Private
 */
router.get("/:id", authMiddleware, getEmployee);

/**
 * @route   PUT /api/employee/:id
 * @desc    Updates employee professional details and the associated user's name.
 * @access  Private
 */
router.put("/:id", authMiddleware, upload.single("image"), updateEmployee);

/**
 * @route   GET /api/employee/department/:id
 * @desc    Fetches all employees belonging to a specific department ID.
 * @access  Private
 */
router.get("/department/:id", authMiddleware, fetchEmployeesByDepId);

/**
 * @route   DELETE /api/employee/:id
 * @desc    Deletes an employee and all their associated data.
 * @access  Private (Admin)
 */
router.delete("/:id", authMiddleware, deleteEmployee);

export default router;
