import Employee from "../models/Employee.js";
import Department from "../models/Department.js";
import Leave from "../models/Leave.js";

/**
 * Fetches a summary of statistics for the admin dashboard,
 * including employee counts, department counts, total salary expenditure,
 * and leave application statistics.
 */
const getSummary = async (req, res) => {
  try {
    // Count total number of employees and departments in the database
    const totalEmployees = await Employee.countDocuments();
    const totalDepartments = await Department.countDocuments();

    // Calculate the sum of all employee salaries using MongoDB aggregation
    const totalSalaries = await Employee.aggregate([
      { $group: { _id: null, totalSalary: { $sum: "$salary" } } },
    ]);

    // Group leave records by their status (Pending, Approved, Rejected) to get counts for each
    const leaveStats = await Leave.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get the count of unique employees who have applied for at least one leave
    const employeeAppliedForLeave = await Leave.distinct("employeeId");

    // Map the aggregation results into a structured summary object
    // Handles both capitalized and lowercase status strings for robustness
    const leaveSummary = {
      appliedFor: employeeAppliedForLeave.length,
      approved:
        leaveStats.find(
          (item) => item._id === "Approved" || item._id === "approved",
        )?.count || 0,
      rejected:
        leaveStats.find(
          (item) => item._id === "Rejected" || item._id === "rejected",
        )?.count || 0,
      pending:
        leaveStats.find(
          (item) => item._id === "Pending" || item._id === "pending",
        )?.count || 0,
    };

    // Return the compiled statistics to the frontend
    return res.status(200).json({
      success: true,
      totalEmployees,
      totalDepartments,
      totalSalary: totalSalaries[0]?.totalSalary || 0,
      leaveSummary,
    });
  } catch (error) {
    console.error("Dashboard Summary Error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Get summary server error" });
  }
};

export default getSummary;
