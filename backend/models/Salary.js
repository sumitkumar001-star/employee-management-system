import mongoose from "mongoose";
import { Schema } from "mongoose";
import Employee from "../models/Employee.js";
import User from "../models/User.js";
import Department from "../models/Department.js";

/**
 * Salary Schema defines the structure for employee payroll records.
 * It tracks the breakdown of an employee's earnings and deductions for a specific pay period.
 */
const salarySchema = new Schema({
  // Reference to the Employee receiving the salary
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  // The fixed base component of the salary
  basicSalary: {
    type: Number,
    required: true,
  },
  // Additional benefits or bonuses (e.g., transport, housing)
  allowances: {
    type: Number,
    required: true,
  },
  // Amounts subtracted (e.g., taxes, insurance, unpaid leaves)
  deductions: {
    type: Number,
    required: true,
  },
  // The final take-home amount: (Basic + Allowances) - Deductions
  netSalary: {
    type: Number,
    required: true,
  },
  // The date when the salary was issued/processed
  payDate: {
    type: Date,
    required: true,
  },
  // Timestamp of when the record was created
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Timestamp of the last modification to this record
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Salary = mongoose.model("Salary", salarySchema);

export default Salary;
