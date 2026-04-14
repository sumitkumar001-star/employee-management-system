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
          "https://employee-management-system-wjrt.vercel.app/api/department",
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
        <div className="flex flex-col justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-4 border-teal-500 mb-4"></div>
          <div className="text-sm sm:text-lg md:text-xl font-semibold text-slate-500 tracking-wide animate-pulse">Loading Departments...</div>
        </div>
      ) : (
        <div className="p-4 sm:p-6 md:p-8 lg:p-10 bg-slate-50 min-h-full">
          <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 md:p-8">
            <div className="mb-6 sm:mb-8 text-center">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight">Manage Departments</h3>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 sm:mb-8">
              <input
                type="text"
                placeholder="Search by Dep Name"
                className="w-full md:w-72 lg:w-80 px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base transition duration-150 ease-in-out"
                onChange={filterDepartments}
              />
              <Link
                to="/admin-dashboard/add-department"
                className="w-full md:w-auto inline-flex justify-center items-center px-6 py-2.5 bg-teal-600 text-white font-bold rounded-lg shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 text-sm sm:text-base"
              >
                Add Department
              </Link>
            </div>
            <div className="mt-2 sm:mt-4 overflow-hidden rounded-lg border border-gray-100">
              <DataTable 
                columns={columns} 
                data={filteredDepartments} 
                pagination 
                responsive 
                highlightOnHover
                pointerOnHover
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DepartmentList;
