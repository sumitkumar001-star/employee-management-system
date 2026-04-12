import React, { useEffect } from "react";
import { useState } from "react";
import fetchDepartments from "../../utils/EmployeeHelper";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import { getEmployees } from "../../utils/EmployeeHelper";

const AddSalary = () => {
  const navigate = useNavigate();
  // State to manage the salary form data for a specific employee
  const [employee, setEmployee] = useState({
    employeeId: "",
    basicSalary: 0,
    allowances: 0,
    deductions: 0,
    payDate: null,
    department: "",
  });
  // State for error handling
  const [error, setError] = useState(null);
  // State to store the list of employees filtered by department
  const [employees, setEmployees] = useState([]);
  // State to store the list of departments for the dropdown
  const [departments, setDepartments] = useState(null);
  const { id } = useParams();

  // Fetch departments to populate the dropdown menu on component mount
  useEffect(() => {
    const getDepartments = async () => {
      const departments = await fetchDepartments();
      setDepartments(departments);
    };
    getDepartments();
  }, []);

  // Fetch existing employee data if an ID is provided in the URL
  useEffect(() => {
    const fetchEmployee = async () => {
      if (!id) return;

      try {
        const response = await axios.get(
          `http://localhost:5000/api/employee/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        if (response.data.success) {
          setEmployee((prevEmployee) => ({
            ...prevEmployee,
            name: response.data.employee.userId.name,
            martialStatus: response.data.employee.martialStatus,
            designation: response.data.employee.designation,
            salary: response.data.employee.salary,
            department: response.data.employee.department._id || response.data.employee.department,
          }));
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          setError(error.response.data.error);
        }
      }
    };
    fetchEmployee();
  }, [id]);

  // Fetch employees belonging to the selected department
  const handleDepartment = async (e) => {
    const departmentId = e.target.value;
    const emps = await getEmployees(departmentId);
    setEmployees(emps);
    setEmployee((prev) => ({
      ...prev,
      department: departmentId,
      employeeId: "", // Reset employee selection when department changes
    }));
  };

  // Update the local state dynamically as the user types in the input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({
      ...employee,
      [name]: value,
    });
  };

  // Handle the form submission to create a new salary record via a POST request
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:5000/api/salary/add`,
        employee,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (response.data.success) {
        navigate("/admin-dashboard/employees");
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    }
  };
  return (
    <>
      {departments && employee ? (
        <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Add Salary</h2>
            <p className="text-slate-500 mt-2">Generate a new salary record for an employee</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/*Department*/}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                  Department
                </label>
                <select
                  name="department"
                  onChange={handleDepartment}
                  value={employee.department} 
                  className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dep) => (
                    <option key={dep._id} value={dep._id}>
                      {dep.dep_name}
                    </option>
                  ))}
                </select>
              </div>

              {/*Employee*/}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                  Employee
                </label>
                <select
                  name="employeeId"
                  onChange={handleChange}
                  value={employee.employeeId}
                  className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                  required
                >
                  <option value="">Select Employee </option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.employeeId}{emp.userId?.name}
                    </option>
                  ))}
                </select>
              </div>

              {/*Basic Salary*/}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                  Basic Salary
                </label>
                <input
                  type="number"
                  name="basicSalary"
                  value={employee.basicSalary}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                  required
                />
              </div>

              {/*Allowances*/}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                  Allowances
                </label>
                <input
                  type="number"
                  name="allowances"
                  onChange={handleChange}
                  value={employee.allowances}
                  className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                  required
                />
              </div>

              {/*Deductions*/}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                  Deductions
                </label>
                <input
                  type="number"
                  name="deductions"
                  value={employee.deductions}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                  required
                />
              </div>

              {/*Pay Date*/}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                  Pay Date
                </label>
                <input
                  type="date"
                  name="payDate"
                  value={employee.payDate || ""}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-8 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-teal-200 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Add Salary Record
            </button>
          </form>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-teal-500 mb-4"></div>
          <div className="text-xl font-semibold text-slate-500 tracking-wide">
            Loading Form Data...
          </div>
        </div>
      )}{" "}
    </>
  );
};

export default AddSalary;
