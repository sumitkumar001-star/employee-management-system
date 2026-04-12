import Department from "../models/Department.js";


/**
 * Retrieves all department records from the database.
 * Returns a list of departments or a 500 error if the database query fails.
 */
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    return res.status(200).json({ success: true, departments });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "get department server error" });
  }
};

/**
 * Creates a new department record.
 * Expects dep_name and description in the request body.
 * Returns the newly created department object on success.
 */
const addDepartment = async (req, res) => {
  try {
    const { dep_name, description } = req.body;
    const newDepartment = new Department({
      dep_name,
      description,
    });
    await newDepartment.save();
    return res.status(201).json({ success: true, department: newDepartment });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "add department server error" });
  }
};

/**
 * Retrieves a single department by its unique ID.
 * The ID is expected as a URL parameter.
 * Returns the department object or a 500 error if not found/error occurs.
 */
const getDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findById({ _id: id })             
    return res.status(200).json({ success: true, department });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "edit department server error" });
  }
};

/**
 * Updates an existing department's details.
 * Finds the department by ID and updates its name and description.
 * { new: true } ensures the updated document is returned in the response.
 */
const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { dep_name, description } = req.body;
    const updateDep = await Department.findByIdAndUpdate({ _id: id }, { dep_name, description }, { new: true })
    return res.status(200).json({ success: true, department: updateDep });
  } catch (error) {
     return res.status(500).json({ success: false, error: "update department server error" });
  }
};

/**
 * Deletes a department from the database.
 * First checks if the department exists, then performs the deletion.
 * Returns a success message or a 404/500 error status.
 */
const deleteDepartment = async (req, res) => {
        try {
      const { id } = req.params;
      const department = await Department.findById({ _id: id });
      if (!department) {
        return res.status(404).json({ success: false, error: "Department not found" });
      }

      await Department.findByIdAndDelete({ _id: id });
      return res.status(200).json({ success: true, message: "Department deleted successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, error: "delete department server error" });
    }
};  

export { addDepartment, getDepartments, getDepartment, updateDepartment, deleteDepartment };
