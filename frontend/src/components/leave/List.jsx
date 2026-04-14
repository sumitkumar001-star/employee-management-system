import React from "react";
import { Link, useParams } from "react-router-dom";
import DataTables from "react-data-table-component";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useAuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";

const List = () => {
    const { user } = useAuthContext();
  const DataTable = DataTables.default;
  // State to store the leave records after applying search filters
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  // State to store the full list of leave records from the server
  const [leaves, setLeaves] = useState([]);
  // State to manage the loading spinner/status
  const [empLoading, setEmpLoading] = useState(false);
  // Extract the employee ID from the URL parameters (used by Admin)
  const { id } = useParams();
  // If no ID in URL, use the logged-in user's ID (used by Employee)
  const employeeId = id || user._id;

  // Filter the leave list based on the search input value (by leave type)
  const handleFilter = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = leaves.filter((leave) =>
      leave.leaveType.toLowerCase().includes(searchTerm),
    );
    setFilteredLeaves(filtered);
  };

  // Define table columns for the Data Table
  const columns = [
    {
      name: "S No",
      selector: (row) => row.sno,
      width: "60px",
    },
    {
      name: "Emp ID",
      selector: (row) => row.empId,
      width: "100px",
    },
    ...(user.role === "admin"
      ? [
          {
            name: "Name",
            selector: (row) => row.name,
            sortable: true,
          },
        ]
      : []),
    {
      name: "Leave Type",
      selector: (row) => row.leaveType,
      sortable: true,
      cell: (row) => <span className="font-semibold text-slate-800 text-[10px] sm:text-xs md:text-sm">{row.leaveType}</span>,
    },
    {
      name: "From",
      selector: (row) => row.startDate,
      width: "100px",
      cell: (row) => <span className="text-[10px] sm:text-xs md:text-sm text-slate-600">{row.startDate}</span>,
    },
    {
      name: "To",
      selector: (row) => row.endDate,
      width: "100px",
      cell: (row) => <span className="text-[10px] sm:text-xs md:text-sm text-slate-600">{row.endDate}</span>,
    },
    {
      name: "Description",
      selector: (row) => row.reason,
      grow: 2,
      cell: (row) => <div className="truncate max-w-[100px] sm:max-w-xs text-slate-600 text-[10px] sm:text-xs md:text-sm">{row.reason}</div>,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      width: "110px",
      cell: (row) => (
        <span
          className={`px-2 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${
            row.status === "Approved"
              ? "bg-green-50 text-green-700 border-green-200"
              : row.status === "Rejected"
              ? "bg-red-50 text-red-700 border-red-200"
              : "bg-yellow-50 text-yellow-700 border-yellow-200"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  // Fetch leave records from the backend on component mount or when employeeId changes
   useEffect(() => {
    const fetchLeaves = async () => {
      setEmpLoading(true);
      try {
        const response = await axios.get(
          `https://employee-management-system-wjrt.vercel.app/api/leave/employee/${employeeId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          let sno = 1;
          // Map the raw data to include serial numbers and formatted dates for the table
          const data = response.data.leaves.map((leave) => ({
            _id: leave._id,
            sno: sno++,
            empId: leave.employeeId.employeeId,
            name: leave.employeeId.userId.name,
            leaveType: leave.leaveType,
            startDate: new Date(leave.startDate).toLocaleDateString(),
            endDate: new Date(leave.endDate).toLocaleDateString(),
            status: leave.status,
            reason: leave.reason,
          }));
          setLeaves(data);
          setFilteredLeaves(data);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
      } finally {
        setEmpLoading(false);
      }
    };
    fetchLeaves();
  }, [employeeId]);


  return (
    <div className="bg-slate-50 min-h-full p-2 sm:p-6 md:p-8 lg:p-10">
      {empLoading ? (
        <div className="flex flex-col justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-4 border-teal-500 mb-4"></div>
          <div className="text-sm sm:text-lg md:text-xl font-semibold text-slate-500 tracking-wide animate-pulse">
            Loading Leave Records...
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-xl p-4 sm:p-6 md:p-8 border border-slate-100">
          <div className="mb-6 sm:mb-8 text-center">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
              Manage Leaves
            </h3>
            <p className="mt-2 text-xs sm:text-sm md:text-base text-slate-500">
              View and track your leave history and current status.
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 sm:mb-8">
            <div className="relative w-full md:w-72 lg:w-80">
              <input
                type="text"
                placeholder="Search by Leave Type..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white text-sm sm:text-base transition-all duration-300"
                onChange={handleFilter}
              />
            </div>
            {user.role === "employee" && (
              <Link
                to="/employee-dashboard/add-leave"
                className="w-full md:w-auto inline-flex justify-center items-center px-6 py-2.5 bg-teal-600 text-white font-bold rounded-lg shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 text-sm sm:text-base"
              >
                Request New Leave
              </Link>
            )}
          </div>
          <div className="mt-2 sm:mt-4 overflow-hidden rounded-lg border border-gray-100">
            <DataTable
              columns={columns}
              data={filteredLeaves}
              pagination
              responsive
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
