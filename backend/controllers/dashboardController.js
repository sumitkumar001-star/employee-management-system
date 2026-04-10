import Employee from "../models/Employee.js";
import Department from "../models/Department.js";
import Leave from "../models/Leave.js";

const getSummary = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const totalDepartments = await Department.countDocuments();

    const totalSalaries = await Employee.aggregate([
      { $group: { _id: null, totalSalary: { $sum: "$salary" } } },
    ]);
    const employeeAppliedForLeave = await Leave.distinct("employeeId");

    const leaveStats = await Leave.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

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

    return res.status(200).json({
      success: true,
      totalEmployees,
      totalDepartments,
      totalSalary: totalSalaries[0]?.totalSalary || 0,
      leaveSummary,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Get summary server error" });
  }
};

export default getSummary;
