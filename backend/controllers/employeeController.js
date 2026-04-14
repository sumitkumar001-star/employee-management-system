import Employee from "../models/Employee.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import multer from "multer";
import Department from "../models/Department.js";

/**
 * Configures Multer to store files in memory as buffers.
 * This is necessary for serverless environments like Vercel which have ephemeral/read-only filesystems.
 */
const storage = multer.memoryStorage();

// Middleware instance for handling multipart/form-data (file uploads)
const upload = multer({ storage: storage });

/**
 * Adds a new employee to the system.
 * 1. Checks if a user with the provided email already exists.
 * 2. If not, creates a new User record (with hashed password and profile image).
 * 3. Creates a corresponding Employee record linked to that User.
 * Returns success message or error if employee already exists.
 */
const addEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      employeeId,
      dob,
      gender,
      martialStatus,
      designation,
      department,
      salary,
      password,
      role,
    } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      const existingEmployee = await Employee.findOne({ userId: user._id });
      if (existingEmployee) {
        return res.status(400).json({
          success: false,
          error: "Employee already exists for this user",
        });
      }
    } else {
      let profilePictureData = "";
      const hashedPassword = await bcrypt.hash(password, 10);
      if (req.file) {
        // Convert the image buffer to a Base64 string to store in the database
        const mimeType = req.file.mimetype;
        const buffer = req.file.buffer;
        profilePictureData = `data:${mimeType};base64,${buffer.toString(
          "base64"
        )}`;
      }
      user = new User({
        name,
        email,
        password: hashedPassword,
        role,
        profilePicture: profilePictureData,
      });
      await user.save();
    }

    const newEmployee = new Employee({
      userId: user._id,
      employeeId: employeeId,
      gmail: email,
      dob,
      gender,
      martialStatus,
      designation,
      department,
      salary,
    });
    await newEmployee.save();
    return res
      .status(201)
      .json({ success: true, message: "Employee added successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Server error in addEmployee" });
  }
};

/**
 * Retrieves all employees from the database.
 * Populates 'userId' (excluding password) and 'department' details for each employee.
 */
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("userId", { password: 0 })
      .populate("department");
    return res.status(200).json({ success: true, employees });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "get employee server error" });
  }
};

/**
 * Retrieves a single employee by ID.
 * Supports lookup by either the Employee document ID or the linked User ID.
 * Returns the populated employee object or a 404 error if not found.
 */
const getEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    let employee = await Employee.findById(id)
      .populate("userId", { password: 0 })
      .populate("department");
    if (!employee) {
      employee = await Employee.findOne({ userId: id })
        .populate("userId", { password: 0 })
        .populate("department");
    }
    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }
    return res.status(200).json({ success: true, employee });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "get employee server error" });
  }
};

/**
 * Updates an existing employee's information.
 * Updates the 'name' in the User collection and professional details 
 * (designation, salary, etc.) in the Employee collection.
 */
const updateEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const { name, martialStatus, designation, department, salary } =
      req.body;

    const employee = await Employee.findById(id);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, error: "Employee not found" });
    }

    // Prepare updates for the User model (name and new profile picture if provided)
    const userUpdateData = { name };
    if (req.file) {
      const mimeType = req.file.mimetype;
      const buffer = req.file.buffer;
      userUpdateData.profilePicture = `data:${mimeType};base64,${buffer.toString(
        "base64"
      )}`;
    }

    // Prepare updates for the Employee model
    const employeeUpdateData = {
      martialStatus,
      designation,
      department,
      salary,
    };

    // Update both User and Employee documents concurrently
    const [updatedUser, updatedEmployee] = await Promise.all([
      User.findByIdAndUpdate(employee.userId, userUpdateData, { new: true }),
      Employee.findByIdAndUpdate(id, employeeUpdateData, { new: true }),
    ]);

    if (!updatedEmployee || !updatedUser) {
      return res
        .status(404)
        .json({ success: false, error: "Could not update employee details" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Employee updated successfully" });
  } catch (error) {
    console.error("Update Employee Error:", error);
    return res
      .status(500)
      .json({ success: false, error: "update employee server error" });
  }
};

/**
 * Fetches a list of employees belonging to a specific department.
 * The department ID is passed as a URL parameter.
 */
const fetchEmployeesByDepId = async (req, res) => {
  const { id } = req.params;
  try {
    const employees = await Employee.find({ department: id });

    return res.status(200).json({ success: true, employees });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "get employeebyDepID server error" });
  }
};

export {
  addEmployee,
  upload,
  getEmployees,
  getEmployee,
  updateEmployee,
  fetchEmployeesByDepId,
};
