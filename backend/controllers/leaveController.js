import Leave from "../models/Leave.js";
import Employee from "../models/Employee.js";
import Department from "../models/Department.js";


/**
 * Handles the creation of a new leave application.
 * It identifies the employee using either employeeId or userId,
 * then saves the leave details (type, dates, reason) to the database.
 */
const addLeave = async (req, res) => {
  try {
    const { employeeId, userId, leaveType, startDate, endDate, reason } = req.body;

    let employee;
    if (employeeId) {
      employee = await Employee.findById(employeeId);
    } else {
      employee = await Employee.findOne({ userId });
    }

    if (!employee) {  
      return res.status(404).json({ success: false, error: "Employee not found" });
    }

    const newLeave = new Leave({
      employeeId: employee._id,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    await newLeave.save();
    return res
      .status(201)
      .json({ success: true, message: "Leave applied successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Add leave server error" });
  }
};

/**
 * Retrieves all leave applications from the database.
 * Populates nested employee details including department and 
 * specific user fields (name, profileImage) for the admin view.
 */
const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate({
      path: "employeeId",
      populate: [
        { path: "department" },
        { path: "userId", select: "name profileImage" },
      ],
    });
    return res.status(200).json({ success: true, leaves });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Get leaves server error" });
  }
};

/**
 * Fetches all leave records belonging to a specific employee.
 * The ID provided can be either the Employee document ID or the User ID.
 * Useful for the employee's personal dashboard to see their history.
 */
const getEmployeeLeaves = async (req, res) => {
  try {
    const { id } = req.params;
    let employee = await Employee.findById(id);

    if (!employee) {
      employee = await Employee.findOne({ userId: id });
    }

    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }

    const leaves = await Leave.find({ employeeId: employee._id }).populate({
      path: "employeeId",
      populate: [
        { path: "department" },
        { path: "userId", select: "name profileImage" },
      ],
    });
    return res.status(200).json({ success: true, leaves });
  } catch (error) {
    console.error("Get employee leaves server error:", error);
    return res.status(500).json({ success: false, error: "Get employee leaves server error" });
  }
};

/**
 * Retrieves the full details of a single leave application by its ID.
 * Used when an admin or manager needs to view the specifics of one request.
 */
const getLeaveDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const leave = await Leave.findById(id).populate({
      path: "employeeId",
      populate: [
        { path: "department" },
        { path: "userId", select: "name profilePicture" },
      ],
    });
    if (!leave) {
      return res.status(404).json({ success: false, error: "Leave not found" });
    }
    return res.status(200).json({ success: true, leave });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Get leave detail server error" });
  }
};

/**
 * Updates the status of a leave application (e.g., Pending to Approved/Rejected).
 * Expects the new status in the request body.
 */
const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const leave = await Leave.findByIdAndUpdate({ _id: id }, { status });

    if (!leave) {
      return res.status(404).json({ success: false, error: "Leave not found" });
    }

    return res.status(200).json({ success: true, leave });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Update leave status server error" });
  }
};

export { 
    addLeave, 
    getLeaves, 
    getEmployeeLeaves, 
    updateLeaveStatus,
    getLeaveDetail
};
