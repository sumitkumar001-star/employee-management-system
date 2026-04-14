import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const columns = [
  {
    name: <div className="text-center w-full">S No.</div>, // Wrap header text in a centered div
    selector: (row) => row.sno,
    width: "100px",
    cell: (row) => <div className="text-center w-full">{row.sno}</div>,
    // Removed headClassName as custom 'name' element handles styling
  },
  {
    name: <div className="text-center w-full">Name</div>, // Wrap header text in a centered div
    selector: (row) => row.name,
    sortable: true,
    width: "180px",
    cell: (row) => <div className="text-center w-full">{row.name}</div>,
    // Removed headClassName
  },
  {
    name: <div className="text-center w-full">Image</div>, // Wrap header text in a centered div
    cell: (row) => (
      <div className="flex justify-center items-center py-2 w-full">
        {row.profileImage}
      </div>
    ),
    width: "100px",
    // Removed headClassName
  },
  {
    name: <div className="text-center w-full">Department</div>, // Wrap header text in a centered div
    selector: (row) => row.dep_name,
    width: "170px",
    cell: (row) => <div className="text-center w-full">{row.dep_name}</div>,
    // Removed headClassName
  },
  {
    name: <div className="text-center w-full">DOB</div>, // Wrap header text in a centered div
    selector: (row) => row.dob,
    width: "130px",
    cell: (row) => <div className="text-center w-full">{row.dob}</div>,
    headClassName: "text-center", // Center the header text using Tailwind CSS
  },

  {
    name: "Action",
    cell: (row) => <EmployeeButtons id={row._id} />,
    headClassName: "text-center", // Center the header text using Tailwind CSS
  },
];

const fetchDepartments = async () => {
  let departments = [];
  try {
    const response = await axios.get("https://employee-management-system-wjrt.vercel.app/api/department", {
      headers: { 
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response.data.success) {
      departments = response.data.departments;
    }
  } catch (error) {
    if (error.response && error.response.data && !error.response.data.success) {
      alert(error.response.data.error || "Failed to fetch departments.");
    } else {
      alert("Network error or server is unreachable.");
    }
  }
  return departments;
};

//Employess for salary form
const getEmployees = async (id) => {
  let employees = [];
  try {
    const response = await axios.get(
      `https://employee-management-system-wjrt.vercel.app/api/employee/department/${id}`,
      {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    if (response.data.success) {
      employees = response.data.employees;
    }
  } catch (error) {
    if (error.response && error.response.data && !error.response.data.success) {
      alert(error.response.data.error || "Failed to fetch departments.");
    } else {
      alert("Network error or server is unreachable.");
    }
  }
  return employees;
};

const EmployeeButtons = ({ id }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap gap-1.5 sm:gap-2 py-2 justify-center items-center w-full">
      <button
        className="w-full sm:w-auto px-2 sm:px-3 py-1 bg-teal-600 text-white text-[10px] sm:text-xs md:text-sm font-medium rounded shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
        onClick={() => navigate(`/admin-dashboard/employees/view/${id}`)}
      >
        View
      </button>
      <button
        className="w-full sm:w-auto px-2 sm:px-3 py-1 bg-blue-600 text-white text-[10px] sm:text-xs md:text-sm font-medium rounded shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        onClick={() => navigate(`/admin-dashboard/employees/edit/${id}`)}
      >
        Edit
      </button>
      <button
        className="w-full sm:w-auto px-2 sm:px-3 py-1 bg-yellow-600 text-white text-[10px] sm:text-xs md:text-sm font-medium rounded shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-200"
        onClick={() => navigate(`/admin-dashboard/employees/salary/${id}`)}
      >
        Salary
      </button>
      <button
        className="w-full sm:w-auto px-2 sm:px-3 py-1 bg-red-600 text-white text-[10px] sm:text-xs md:text-sm font-medium rounded shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
        onClick={() => navigate(`/admin-dashboard/employees/leaves/${id}`)}
      >
        Leave
        
      </button>
    </div>
  );
};

export default fetchDepartments;
export { EmployeeButtons, columns, getEmployees };
