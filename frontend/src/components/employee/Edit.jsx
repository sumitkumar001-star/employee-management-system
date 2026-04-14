import React, { useEffect } from "react";
import { useState } from "react";
import fetchDepartments from "../../utils/EmployeeHelper";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";

const Edit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  // State to store the specific employee fields that are editable
  const [employee, setEmployee] = useState({
    name: "",
    martialStatus: "",
    designation: "",
    salary: 0,
    department: "",
  });
  // State for error handling and fetching the list of departments for the dropdown
  const [error, setError] = useState(null);
  const [departments, setDepartments] = useState(null);

  // Fetch departments to populate the dropdown menu on component mount
  useEffect(() => {
    const getDepartments = async () => {
      const departments = await fetchDepartments();
      setDepartments(departments);
    };
    getDepartments();
  }, []);

  // Fetch the existing employee data from the server using the ID from URL params
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          `https://employee-management-system-wjrt.vercel.app/api/employee/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        if (response.data.success) {
          // Map the nested API response to the flat local state structure
          setEmployee((prevEmployee) => ({
            ...prevEmployee,
            name: response.data.employee.userId.name,
            martialStatus: response.data.employee.martialStatus,
            designation: response.data.employee.designation,
            salary: response.data.employee.salary,
            department: response.data.employee.department._id,
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

  // Update the local state dynamically as the user types in the input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({
      ...employee,
      [name]: value,
    });
  };

  // Handle the form submission to update employee records via a PUT request
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `https://employee-management-system-wjrt.vercel.app/api/employee/${id}`,
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
      {departments && employee ? ( // Ensure both are loaded before rendering the form
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-4xl bg-white p-4 md:p-8 rounded-xl shadow-lg">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
                Edit Employee Details
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/*Name*/}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    onChange={handleChange}
                    value={employee.name}
                    placeholder="e.g., Jane Doe" 
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-sm transition duration-150 ease-in-out"
                    required
                  />
                </div>

                {/*Marital Status*/}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Marital Status
                  </label>
                  <select
                    name="martialStatus"
                    onChange={handleChange}
                    value={employee.martialStatus}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-sm transition duration-150 ease-in-out"
                    required
                  >
                    <option value="">Select Marital Status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                  </select>
                </div>

                {/*Designation*/}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    name="designation"
                    onChange={handleChange}
                    value={employee.designation}
                    placeholder="e.g., Senior Developer" 
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-sm transition duration-150 ease-in-out"
                    required
                  />
                </div>

                {/*Salary*/}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary
                  </label>
                  <input
                    type="number"
                    name="salary"
                    onChange={handleChange}
                    value={employee.salary}
                    placeholder="e.g., 75000" 
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-sm transition duration-150 ease-in-out"
                    required
                  />
                </div>

                {/*Department*/}
                <div>
                  {" "}
                  {/* Removed col-span-2 to keep consistent two-column layout for smaller screens */}
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <select
                    name="department"
                    onChange={handleChange}
                    value={employee.department}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-sm transition duration-150 ease-in-out"
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

                <div className="md:col-span-2 pt-4">
                  {" "}
                  {/* Button spans full width on medium screens and up */}
                  <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
                  >
                    Update Employee
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : (
        // Consistent loading state
        <div className="flex flex-col justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-4 border-teal-500 mb-4"></div>
          <div className="text-sm sm:text-lg md:text-xl font-semibold text-slate-500 tracking-wide animate-pulse">
            Loading employee details...
          </div>
        </div>
      )}{" "}
    </>
  );
};

export default Edit;
