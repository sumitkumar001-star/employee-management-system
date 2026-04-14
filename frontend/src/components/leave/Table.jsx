import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTables from "react-data-table-component";
import { useNavigate } from "react-router-dom";

const Table = () => {
  // State to store the full list of leave records from the server
  const [leaves, setLeaves] = useState([]);
  // State to store the leave records after applying search or status filters
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  // State to manage the loading spinner/status
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const DataTable = DataTables.default;

  // Fetch all leave records from the backend (Admin view)
  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://employee-management-system-wjrt.vercel.app/api/leave", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        let sno = 1;
        // Map the raw data to include serial numbers and calculate duration for the table
        const data = response.data.leaves.map((leave) => ({
          _id: leave._id,
          sno: sno++,
          employeeId: leave.employeeId.employeeId,
          name: leave.employeeId.userId.name,
          department: leave.employeeId.department.dep_name,
          leaveType: leave.leaveType,
          days: Math.ceil(
            (new Date(leave.endDate) - new Date(leave.startDate)) /
              (1000 * 60 * 60 * 24) + 1
          ),
          status: leave.status,
        }));
        setLeaves(data);
        setFilteredLeaves(data);
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // Filter the leave list based on the search input value (by name or employee ID)
  const handleFilter = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = leaves.filter(
      (leave) =>
        leave.name.toLowerCase().includes(searchTerm) ||
        leave.employeeId.toLowerCase().includes(searchTerm)
    );
    setFilteredLeaves(filtered);
  };

  // Filter the leave list based on the status buttons (Pending, Approved, etc.)
  const filterByStatus = (status) => {
    if (status === "All") {
      setFilteredLeaves(leaves);
    } else {
      const filtered = leaves.filter((leave) => leave.status === status);
      setFilteredLeaves(filtered);
    }
  };

  // Define table columns for the Data Table
  const columns = [
    {
      name: "S No",
      selector: (row) => row.sno,
      width: "60px",
      cell: (row) => <span className="text-[10px] sm:text-xs md:text-sm">{row.sno}</span>,
    },
    {
      name: "Emp ID",
      selector: (row) => row.employeeId,
      width: "90px",
      cell: (row) => <span className="text-[10px] sm:text-xs md:text-sm">{row.employeeId}</span>,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => <span className="text-[10px] sm:text-xs md:text-sm font-medium truncate">{row.name}</span>,
    },
    {
      name: "Department",
      selector: (row) => row.department,
      cell: (row) => <span className="text-[10px] sm:text-xs md:text-sm truncate">{row.department}</span>,
    },
    {
      name: "Leave Type",
      selector: (row) => row.leaveType,
      cell: (row) => <span className="text-[10px] sm:text-xs md:text-sm">{row.leaveType}</span>,
    },
    {
      name: "Days",
      selector: (row) => row.days,
      width: "60px",
      cell: (row) => <span className="text-[10px] sm:text-xs md:text-sm">{row.days}</span>,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wider border ${
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
    {
      name: "Action",
      cell: (row) => (
        <button
          className="px-2 py-1 sm:px-4 sm:py-1.5 bg-teal-600 text-white text-[10px] sm:text-xs md:text-sm font-medium rounded-lg hover:bg-teal-700 shadow-sm transition-all duration-200"
          onClick={() => navigate(`/admin-dashboard/leaves/${row._id}`)}
        >
          View
        </button>
      ),
    },
  ];

  return (
    <div className="bg-slate-50 min-h-full p-2 sm:p-6 md:p-8 lg:p-10">
      {loading ? (
        <div className="flex flex-col justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-4 border-teal-500 mb-4"></div>
          <div className="text-sm sm:text-lg md:text-xl font-semibold text-slate-500 tracking-wide animate-pulse">
            Loading Leave Requests...
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-xl p-4 sm:p-6 md:p-8 border border-slate-100">
          <div className="mb-6 sm:mb-8 text-center">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
              Manage Leave Requests
            </h3>
            <p className="mt-2 text-xs sm:text-sm md:text-base text-slate-500">
              Review and manage employee leave applications.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6 sm:mb-8">
            <div className="relative w-full lg:w-80 xl:w-96">
              <input
                type="text"
                placeholder="Search by Name or ID..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white text-sm sm:text-base transition-all duration-300"
                onChange={handleFilter}
              />
            </div>
            <div className="flex flex-wrap justify-center lg:justify-end gap-2 w-full lg:w-auto">
              {["All", "Pending", "Approved", "Rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => filterByStatus(status)}
                  className="flex-1 sm:flex-none px-3 py-2 sm:px-4 text-[10px] sm:text-xs md:text-sm font-bold bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-teal-600 hover:text-white hover:border-teal-600 transition-all duration-200 shadow-sm uppercase tracking-wider"
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-2 sm:mt-4 overflow-hidden rounded-lg border border-gray-100">
            <DataTable
              columns={columns}
              data={filteredLeaves}
              pagination
              responsive
              highlightOnHover
            />
          </div>
        </div>
      )}
    </div>
  );            
};

export default Table;