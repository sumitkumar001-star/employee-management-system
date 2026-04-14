import React from "react";
import { Link } from "react-router-dom";
import DataTables from "react-data-table-component";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const List = () => {
  // Accessing the default export of react-data-table-component
  const DataTable = DataTables.default;
  // State to store the employees after applying search filters
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  // State to store the full list of employees from the server
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();
  // State to manage the loading spinner/status
  const [empLoading, setEmpLoading] = useState(false);

  // Handle the deletion of an employee
  const handleDelete = async (id) => {
    // Confirm with the user before deleting
    if (window.confirm("Are you sure you want to delete this employee? This will also remove their user account, leave history, and salary records. This action cannot be undone.")) {
      try {
        const response = await axios.delete(`https://employee-management-system-wjrt.vercel.app/api/employee/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data.success) {
          // Refresh the employee list by filtering out the deleted employee
          setEmployees(prev => prev.filter(emp => emp._id !== id));
          setFilteredEmployees(prev => prev.filter(emp => emp._id !== id));
          alert("Employee deleted successfully.");
        }
      } catch (error) {
        const errorMessage = error.response?.data?.error || "An error occurred while deleting the employee.";
        alert(errorMessage);
      }
    }
  };

  // Define columns for the DataTable
  const columns = [
    {
      name: <div className="text-center w-full text-xs sm:text-sm md:text-base">S No.</div>,
      selector: (row) => row.sno,
      cell: (row) => <div className="text-center w-full text-xs sm:text-sm">{row.sno}</div>,
      sortable: true,
      width: "70px",
    },
    {
      name: <div className="text-center w-full text-xs sm:text-sm md:text-base">Profile</div>,
      selector: (row) => row.profileImage,
      cell: (row) => <div className="flex justify-center w-full">{row.profileImage}</div>,
      center: true,
      width: "90px",
    },
    {
      name: <div className="text-center w-full text-xs sm:text-sm md:text-base">Name</div>,
      selector: (row) => row.name,
      cell: (row) => <div className="text-center w-full text-xs sm:text-sm truncate px-1">{row.name}</div>,
      sortable: true,
    },
    {
      name: <div className="text-center w-full text-xs sm:text-sm md:text-base">Department</div>,
      selector: (row) => row.dep_name,
      cell: (row) => <div className="text-center w-full text-xs sm:text-sm">{row.dep_name}</div>,
      sortable: true,
    },
    {
      name: <div className="text-center w-full text-xs sm:text-sm md:text-base">DOB</div>,
      selector: (row) => row.dob,
      cell: (row) => <div className="text-center w-full text-xs sm:text-sm">{row.dob}</div>,
      sortable: true,
    },
    {
      name: <div className="text-center w-full text-xs sm:text-sm md:text-base">Action</div>,
      cell: (row) => (
        <div className="flex flex-col lg:flex-row items-center gap-1.5 sm:gap-2 justify-center w-full py-2">
          <Link to={`/admin-dashboard/employees/view/${row._id}`} className="px-2 py-1 sm:text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors w-full lg:w-auto text-center">
            View
          </Link>
          <Link to={`/admin-dashboard/employees/edit/${row._id}`} className="px-2 py-1  sm:text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors w-full lg:w-auto text-center">
            Edit
          </Link>
          <Link to={`/admin-dashboard/employees/salary/${row._id}`} className="px-2 py-1 sm:text-xs font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700 transition-colors w-full lg:w-auto text-center">
            Salary
          </Link>
          <button onClick={() => handleDelete(row._id)} className="px-2 py-1 sm:text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors w-full lg:w-auto text-center">
            Delete
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "170px",
    },
  ];

  // Fetch employees from the backend on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      setEmpLoading(true);
      try {
        // Send a GET request with the authorization token
        const response = await axios.get("https://employee-management-system-wjrt.vercel.app/api/employee", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data.success) {
          let sno = 1;

          // Map the raw data to include serial numbers and formatted fields for the table
          const data = response.data.employees.map((emp) => ({
            _id: emp._id,
            sno: sno++,
            dep_name: emp.department?.dep_name || "N/A",
            name: emp.userId?.name || "N/A",
            dob: new Date(emp.dob).toLocaleDateString(),
            profileImage: (
              <img
                className="rounded-full w-8 h-8 sm:w-10 sm:h-10 object-cover shadow-sm"
                src={emp.userId?.profilePicture}
                alt={emp.userId?.name}
              />
            )
          }));
          setEmployees(data);
          setFilteredEmployees(data);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
      } finally {
        setEmpLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // Filter the employee list based on the search input value (by name)
  const handleFilter = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = employees.filter((emp) =>
      emp.name.toLowerCase().includes(searchTerm),
    );
    setFilteredEmployees(filtered);
  };

  return (
    <>
      {empLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-base sm:text-lg font-semibold text-gray-600 animate-pulse">
            Loading Employees...
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-6 md:p-8 lg:p-10 bg-slate-50 min-h-full">
          <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 md:p-8">
            <div className="mb-6 sm:mb-8 text-center">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight">
                Manage Employees
              </h3>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 sm:mb-8">
              <input
                type="text"
                placeholder="Search by Emp Name"
                className="w-full md:w-72 lg:w-80 px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base transition duration-150 ease-in-out"
                onChange={handleFilter}
              />
              <Link
                to="/admin-dashboard/add-employee"
                className="w-full md:w-auto inline-flex justify-center items-center px-6 py-2.5 bg-teal-600 text-white font-bold rounded-lg shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 text-sm sm:text-base"
              >
                Add New Employee
              </Link>
            </div>
            <div className="mt-2 sm:mt-4 overflow-hidden rounded-lg border border-gray-100">
              <DataTable
                columns={columns}
                data={filteredEmployees}
                pagination
                responsive
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default List;
