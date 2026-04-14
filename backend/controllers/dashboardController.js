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
    // Concurrently execute all database queries for maximum efficiency
    const [
      totalDepartments,
      employeeStats,
      leaveData,
    ] = await Promise.all([
      // Query 1: Count total departments
      Department.countDocuments(),

      // Query 2: Aggregate total employees and total salary in a single pipeline
      Employee.aggregate([
        {
          $group: {
            _id: null,
            totalEmployees: { $sum: 1 },
            totalSalary: { $sum: "$salary" },
          },
        },
      ]),

      // Query 3: Use $facet to get leave counts by status and distinct employees in one pipeline
      Leave.aggregate([
        {
          $facet: {
            byStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
            distinctEmployees: [
              { $group: { _id: "$employeeId" } },
              { $count: "count" },
            ],
          },
        },
      ]),
    ]);

    // Process the results from the aggregation pipelines
    const employeeSummary = employeeStats[0] || { totalEmployees: 0, totalSalary: 0 };
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
      totalEmployees: employeeSummary.totalEmployees,
      totalDepartments,
      totalSalary: employeeSummary.totalSalary,
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
