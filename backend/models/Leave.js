import mongoose from "mongoose";
import { Schema } from "mongoose";

/**
 * Leave Schema defines the structure for employee leave applications.
 * It tracks the type of leave, duration, reason, and the current approval status.
 */
const leaveSchema = new Schema({
  // Reference to the Employee who is applying for the leave
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  // Category of leave being requested
  leaveType: {
    type: String,
    enum: ["Sick Leave", "Casual Leave", "Annual Leave"],
    required: true,
  },
  // The first day of the requested leave period
  startDate: {
    type: Date,
    required: true,
  },
  // The last day of the requested leave period
  endDate: {
    type: Date,
    required: true,
  },
  // Detailed explanation or justification for the leave request
  reason: {
    type: String,
    required: true,
  },
  // Current state of the application (managed by Admin/HR)
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  // Timestamp of when the application was submitted
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  // Timestamp of the last modification (e.g., when status was updated)
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Leave = mongoose.model("Leave", leaveSchema);

export default Leave;
