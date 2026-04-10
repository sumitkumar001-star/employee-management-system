import Salary from "../models/Salary.js";
import Employee from "../models/Employee.js";


const addSalary = async (req, res) => {
  try {
    const { employeeId, basicSalary, allowances, deductions, payDate } =
      req.body;

    // Calculate netSalary
    const netSalary =
      (Number(basicSalary) || 0) +
      (Number(allowances) || 0) -
      (Number(deductions) || 0);

    const newSalary = new Salary({
      employeeId,
      basicSalary,
      allowances,
      deductions,
      netSalary, // use calculated value
      payDate,
    });

    await newSalary.save();
    return res
      .status(201)
      .json({ success: true, message: "Salary added successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Server error in addSalary" });
  }
};

const getSalary = async (req, res) => {
    try {
    const { id } = req.params;
    let salaries = await Salary.find({ employeeId: id }).populate("employeeId");
    
    // If not found by direct employeeId, try treating id as a userId (for employee dashboard)
    if (!salaries || salaries.length < 1) {
      const employee = await Employee.findOne({ userId: id });   
      if (employee) {
        salaries = await Salary.find({ employeeId: employee._id }).populate("employeeId"); 
      }
    }
    return res.status(200).json({ success: true, salaries });
  } catch (error) { 
    return res
      .status(500)
      .json({ success: false, error: "get salary server error" });
  } 
};
 


export { addSalary, getSalary };
