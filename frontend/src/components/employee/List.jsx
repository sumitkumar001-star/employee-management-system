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
      name: <div className="text-center w-full">S No.</div>,
      selector: (row) => row.sno,
      cell: (row) => <div className="text-center w-full">{row.sno}</div>,
      sortable: true,
      width: "80px",
    },
    {
      name: <div className="text-center w-full">Profile</div>,
      selector: (row) => row.profileImage,
      cell: (row) => <div className="flex justify-center w-full">{row.profileImage}</div>,
      center: true,
      width: "100px",
    },
    {
      name: <div className="text-center w-full">Name</div>,
      selector: (row) => row.name,
      cell: (row) => <div className="text-center w-full">{row.name}</div>,
      sortable: true,
    },
    {
      name: <div className="text-center w-full">Department</div>,
      selector: (row) => row.dep_name,
      cell: (row) => <div className="text-center w-full">{row.dep_name}</div>,
      sortable: true,
    },
    {
      name: <div className="text-center w-full">DOB</div>,
      selector: (row) => row.dob,
      cell: (row) => <div className="text-center w-full">{row.dob}</div>,
      sortable: true,
    },
    {
      name: <div className="text-center w-full">Action</div>,
      cell: (row) => (
        <div className="flex flex-col lg:flex-row items-center gap-2 justify-center w-full">
          <Link to={`/admin-dashboard/employees/view/${row._id}`} className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors w-full lg:w-auto text-center">
            View
          </Link>
          <Link to={`/admin-dashboard/employees/edit/${row._id}`} className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors w-full lg:w-auto text-center">
            Edit
          </Link>
          <Link to={`/admin-dashboard/employees/salary/${row._id}`} className="px-3 py-1 text-sm font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700 transition-colors w-full lg:w-auto text-center">
            Salary
          </Link>
          <button onClick={() => handleDelete(row._id)} className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors w-full lg:w-auto">
            Delete
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "150px",
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
                width={40}
            //    className="rounded-full"
                className="rounded-full w-10 h-10 object-cover"
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
        <div className="flex justify-center items-center h-64">
          <div className="text-lg font-semibold text-gray-600">
            Loading Employees...
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
            <div className="mb-6 text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                Manage Employees
              </h3>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
              <input
                type="text"
                placeholder="Search by Emp Name"
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-150 ease-in-out"
                onChange={handleFilter}
              />
              <Link
                to="/admin-dashboard/add-employee"
                className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 bg-teal-600 text-white font-medium rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
              >
                Add New Employee
              </Link>
            </div>
            <div className="mt-5 overflow-x-auto">
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
