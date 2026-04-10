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

router.post("/add", authMiddleware, addLeave);
router.get("/", authMiddleware, getLeaves); // Admin: Get all leaves
router.get("/:id", authMiddleware, getLeaveDetail);
router.get("/employee/:id", authMiddleware, getEmployeeLeaves); 
router.put("/:id", authMiddleware, updateLeaveStatus); // Admin: Update status

export default router;
