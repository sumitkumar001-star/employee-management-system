import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTables from "react-data-table-component";
import { useNavigate } from "react-router-dom";

const Table = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const DataTable = DataTables.default;

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/leave", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        let sno = 1;
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

  const handleFilter = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = leaves.filter(
      (leave) =>
        leave.name.toLowerCase().includes(searchTerm) ||
        leave.employeeId.toLowerCase().includes(searchTerm)
    );
    setFilteredLeaves(filtered);
  };

  const filterByStatus = (status) => {
    if (status === "All") {
      setFilteredLeaves(leaves);
    } else {
      const filtered = leaves.filter((leave) => leave.status === status);
      setFilteredLeaves(filtered);
    }
  };

  const columns = [
    {
      name: "S No",
      selector: (row) => row.sno,
      width: "70px",
    },
    {
      name: "Emp ID",
      selector: (row) => row.employeeId,
      width: "120px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Department",
      selector: (row) => row.department,
    },
    {
      name: "Leave Type",
      selector: (row) => row.leaveType,
    },
    {
      name: "Days",
      selector: (row) => row.days,
      width: "80px",
    },
    {
      name: "Status",
      selector: (row) => row.status,
      cell: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
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
          className="px-4 py-1.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 shadow-sm transition-all duration-200"
          onClick={() => navigate(`/admin-dashboard/leaves/${row._id}`)}
        >
          View
        </button>
      ),
    },
  ];

  return (
    <div className="bg-slate-50 min-h-full p-4 sm:p-6 lg:p-8">
      {loading ? (
        <div className="flex flex-col justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-teal-500 mb-4"></div>
          <div className="text-xl font-semibold text-slate-500 tracking-wide">
            Loading Leave Requests...
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-slate-100">
          <div className="mb-8 text-center sm:text-left">
            <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Manage Leave Requests
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Review and manage employee leave applications.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-8">
            <div className="relative w-full lg:w-96">
              <input
                type="text"
                placeholder="Search by Name or ID..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white transition-all duration-300"
                onChange={handleFilter}
              />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {["All", "Pending", "Approved", "Rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => filterByStatus(status)}
                  className="px-4 py-2 text-sm font-semibold bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-teal-600 hover:text-white hover:border-teal-600 transition-all duration-200 shadow-sm"
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
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