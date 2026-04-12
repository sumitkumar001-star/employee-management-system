import React, { useEffect, useState } from "react";
import  { Link } from "react-router-dom";
import  DataTables from "react-data-table-component";
import { columns, DepartmentButtons } from "../../utils/DepartmentHelper";
import axios from "axios";




const DepartmentList = () => {
  // State to store the full list of departments from the server
  const [departments, setDepartments] = useState([]);
  // State to manage the loading spinner/status
  const [depLoading, setDepLoading] = useState(false);
  // Accessing the default export of react-data-table-component
  const DataTable = DataTables.default;
  // State to store the departments after applying search filters
  const [filteredDepartments, setFilteredDepartments] = useState([]);

  // Callback function to update the UI state when a department is deleted
  const onDepartmentDelete = (id) => {
    setDepartments((prevDeps) => 
      prevDeps.filter((dep) => dep._id !== id).map((dep, index) => ({ ...dep, sno: index + 1 }))
    );
    setFilteredDepartments((prevDeps) => 
      prevDeps.filter((dep) => dep._id !== id).map((dep, index) => ({ ...dep, sno: index + 1 }))
    );
  };

  // Fetch departments from the backend on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      setDepLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/department",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        if (response.data.success) {
          let sno = 1;

          // Map the raw data to include serial numbers and the delete callback for the action buttons
          const data = response.data.departments.map((dep) => ({
            _id: dep._id,
            sno: sno++,
            dep_name: dep.dep_name,
            description: dep.description,
            onDepartmentDelete: onDepartmentDelete,
          }));
          setDepartments(data);
          setFilteredDepartments(data);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
      } finally {
        setDepLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  // Filter the department list based on the search input value
  const filterDepartments = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const records = departments.filter((dep) =>
      dep.dep_name.toLowerCase().includes(searchTerm)
    );
    setFilteredDepartments(records);
  }



  return (
    <>
      {depLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg font-semibold text-gray-600">Loading Departments...</div>
        </div>
      ) : (
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="mb-6 text-center">
              <h3 className="text-3xl font-bold text-gray-800">Manage Departments</h3>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
              <input
                type="text"
                placeholder="Search by Dep Name"
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-150 ease-in-out"
                onChange={filterDepartments}
              />
              <Link
                to="/admin-dashboard/add-department"
                className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 bg-teal-600 text-white font-medium rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
              >
                Add Department
              </Link>
            </div>
            <div className="mt-5 overflow-x-auto">
              <DataTable columns={columns} data={filteredDepartments} pagination responsive />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DepartmentList;
