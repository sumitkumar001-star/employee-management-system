import Employee from "../models/Employee.js";
import Department from "../models/Department.js";
import Leave from "../models/Leave.js";
import Salary from "../models/Salary.js";

/**
 * Fetches a summary of statistics for the admin dashboard,
 * including employee counts, department counts, total salary expenditure,
 * and leave application statistics.
 */
const getSummary = async (req, res) => {
  try {
    // Get start and end of the current month for salary query
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999); // Ensure we cover the whole last day of the month

    // Concurrently execute all database queries for maximum efficiency
    const [
      totalDepartments,
      totalEmployees,
      monthlySalaryData,
      leaveData,
    ] = await Promise.all([
      // Query 1: Count total departments
      Department.countDocuments(),

      // Query 2: Count total employees
      Employee.countDocuments(),

      // Query 3: Aggregate total net salary paid in the current month
      Salary.aggregate([
        {
          $match: {
            payDate: {
              $gte: startOfMonth,
              $lte: endOfMonth,
            },
          },
        },
        {
          $group: {
            _id: null,
            totalSalary: { $sum: "$netSalary" },
          },
        },
      ]),

      // Query 4: Use $facet to get leave counts by status and distinct employees in one pipeline
      Leave.aggregate([
        {
          $facet: {
            byStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
            distinctEmployees: [{ $group: { _id: "$employeeId" } }, { $count: "count" }],
          },
        },
      ]),
    ]);

    // Process the results from the aggregation pipelines
    const totalSalary = monthlySalaryData[0]?.totalSalary || 0;
    const leaveStats = leaveData[0];

    const leaveSummary = {
      appliedFor: leaveStats.distinctEmployees[0]?.count || 0,
      approved: leaveStats.byStatus.find(item => item._id.toLowerCase() === "approved")?.count || 0,
      rejected: leaveStats.byStatus.find(item => item._id.toLowerCase() === "rejected")?.count || 0,
      pending: leaveStats.byStatus.find(item => item._id.toLowerCase() === "pending")?.count || 0,
    };

    // Return the compiled statistics to the frontend
    return res.status(200).json({
      success: true,
      totalEmployees,
      totalDepartments,
      totalSalary,
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
