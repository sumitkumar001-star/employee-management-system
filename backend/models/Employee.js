import mongoose from "mongoose";
import { Schema } from "mongoose";

/**
 * Employee Schema defines the professional and personal details of an employee.
 * It links to the User model for authentication and the Department model for organization.
 */
const employeeSchema = new Schema({
    // Reference to the User collection for login credentials and basic info
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // Unique organizational identifier for the employee
    employeeId: {
        type: String,
        required: true,
        unique: true,
    },
    // Professional email address
    gmail: {
        type: String,
        required: true,
        unique: true,
    },
    // Date of birth for age verification and records
    dob: {
        type: Date,
        required: true,
    },
    gender: {
        type: String
    },
    martialStatus: {
        type: String
    },
    // Job title (e.g., Software Engineer, Manager)
    designation: {
        type: String,
        required: true,
    },
    // Reference to the Department the employee belongs to
    department: {
        type: Schema.Types.ObjectId,
        ref: 'Department',   
        required: true
    },
    // Base salary amount
    salary: {
        type: Number,
        required: true,
    },
    // Record creation timestamp
    createdAt: {
        type: Date,
        default: Date.now,
    },
    // Record last update timestamp
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;