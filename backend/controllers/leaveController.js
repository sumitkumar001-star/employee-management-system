import Leave from "../models/Leave.js";
import Employee from "../models/Employee.js";
import Department from "../models/Department.js";


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

// New controller to get a single leave by its _id
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
