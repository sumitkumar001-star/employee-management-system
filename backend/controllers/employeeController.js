import path from "path";
import Employee from "../models/Employee.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import multer from "multer";
import Department from "../models/Department.js";

/**
 * Configures Multer storage settings.
 * Files are stored in 'public/uploads' with a unique timestamp-based filename.
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

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
      image,
    } = req.body;

    let user = await User.findOne({ email });
    const hashedPassword = await bcrypt.hash(password, 10);

    if (user) {
      const existingEmployee = await Employee.findOne({ userId: user._id });
      if (existingEmployee) {
        return res.status(400).json({
          success: false,
          error: "Employee already exists for this user",
        });
      }
    } else {
      user = new User({
        name,
        email,
        password: hashedPassword,
        role,
        profilePicture: req.file ? req.file.filename : "",
      });
      await user.save();
    }

    const newEmployee = new Employee({
      userId: user._id,
      employeeId: employeeId,
      gmail: email,
      password: hashedPassword,
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
    const { name, martialStatus, designation, department, salary } = req.body;

    const employee = await Employee.findById({ _id: id });
    if (!employee) {
      return res
        .status(400)
        .json({ success: false, error: "Employee not found" });
    }
    const user = await User.findById({ _id: employee.userId });
    if (!user) {
      return res.status(400).json({ success: false, error: "User not found" });
    }
    const updateUser = await User.findByIdAndUpdate(
      { _id: user._id },
      { name },
    );
    const updateEmployee = await Employee.findByIdAndUpdate(
      { _id: id },
      {
        martialStatus,
        designation,
        department,
        salary,
      },
    );
    if (!updateEmployee || !updateUser) {
      return res
        .status(404)
        .json({ success: false, error: "Employee not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Employee updated successfully" });
  } catch (error) {
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
