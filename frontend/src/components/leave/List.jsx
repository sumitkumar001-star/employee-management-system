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
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [empLoading, setEmpLoading] = useState(false);
  const { id } = useParams();
  const employeeId = id || user._id;


  const handleFilter = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = employees.filter((leave) =>
      leave.leaveType.toLowerCase().includes(searchTerm),
    );
    setFilteredEmployees(filtered);
  };

  const columns = [
    {
      name: "S No",
      selector: (row) => row.sno,
      width: "70px",
    },
    {
      name: "Emp ID",
      selector: (row) => row.empId,
      width: "120px",
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
      cell: (row) => <span className="font-semibold text-slate-800 text-sm">{row.leaveType}</span>,
    },
    {
      name: "From",
      selector: (row) => row.startDate,
      width: "140px",
      cell: (row) => <span className="text-sm text-slate-600">{row.startDate}</span>,
    },
    {
      name: "To",
      selector: (row) => row.endDate,
      width: "140px",
      cell: (row) => <span className="text-sm text-slate-600">{row.endDate}</span>,
    },
    {
      name: "Description",
      selector: (row) => row.reason,
      grow: 2,
      cell: (row) => <div className="truncate max-w-xs text-slate-600 text-sm">{row.reason}</div>,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      width: "140px",
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

   useEffect(() => {
    const fetchLeaves = async () => {
      setEmpLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/leave/employee/${employeeId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          let sno = 1;
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
    fetchLeaves();
  }, [employeeId]);


  return (
    <div className="bg-slate-50 min-h-full p-4 sm:p-6 lg:p-8">
      {empLoading ? (
        <div className="flex flex-col justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-teal-500 mb-4"></div>
          <div className="text-xl font-semibold text-slate-500 tracking-wide">
            Loading Leave Records...
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-slate-100">
          <div className="mb-8 text-center sm:text-left">
            <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Manage Leaves
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              View and track your leave history and current status.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Search by Leave Type..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white transition-all duration-300"
                onChange={handleFilter}
              />
            </div>
            {user.role === "employee" && (
              <Link
                to="/employee-dashboard/add-leave"
                className="w-full sm:w-auto inline-flex justify-center items-center px-5 py-2.5 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Request New Leave
              </Link>
            )}
          </div>
          <div className="mt-6 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <DataTable
              columns={columns}
              data={filteredEmployees}
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
