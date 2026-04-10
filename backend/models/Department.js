import mongoose from "mongoose";
import Employee from "./Employee.js";
import User from "./User.js";
import Salary from "./Salary.js";
import Leave from "./Leave.js";


const departmentSchema = new mongoose.Schema({
  dep_name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
departmentSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      const Employee = mongoose.model("Employee");
      const User = mongoose.model("User");
      const Salary = mongoose.model("Salary");
      const Leave = mongoose.model("Leave");

      const employees = await Employee.find({ department: this._id });
      const employeeIds = employees.map((emp) => emp._id);
      const userIds = employees.map((emp) => emp.userId);

      await Employee.deleteMany({ department: this._id });
      await User.deleteMany({ _id: { $in: userIds } });
      await Salary.deleteMany({ employeeId: { $in: employeeIds } });
      await Leave.deleteMany({ employeeId: { $in: employeeIds } });

      next();
    } catch (error) {
      next(error);
    }
  }
);

const Department = mongoose.model("Department", departmentSchema);

export default Department;
