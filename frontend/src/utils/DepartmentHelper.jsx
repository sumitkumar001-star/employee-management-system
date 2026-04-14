import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const columns = [
  {
    name: <div className="text-center w-full">S No.</div>, // Custom header for centering
    selector: (row) => row.sno,
    cell: (row) => <div className="text-center w-full">{row.sno}</div>, // Ensure cell content is centered
  },
  {
    // Column for the department name with sorting enabled
    name: <div className="text-center w-full">Department Name</div>,
    selector: (row) => row.dep_name,
    sortable: true,
    cell: (row) => <div className="text-center w-full">{row.dep_name}</div>,
  },
  {
    name: <div className="text-center w-full">Action</div>, // Custom header for centering
    cell: (row) => <div className="flex justify-center w-full"><DepartmentButtons id={row._id} onDepartmentDelete={row.onDepartmentDelete} /></div>,
  },
];
const DepartmentButtons = ({ id, onDepartmentDelete: onDepartmentDeleteProp }) => {
  const navigate = useNavigate();

  const handleDelete = async (depId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this department?")
    if (!confirmDelete) {
      return;
    }
    try {
      const response = await axios.delete(`https://employee-management-system-wjrt.vercel.app/api/department/${depId}`, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
      });
      if (response.data.success) {
        onDepartmentDeleteProp(depId);
        alert("Department deleted successfully");
      } else {
        alert("Failed to delete department");
      }
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <button
        className="px-3 py-1 bg-blue-600 text-white rounded shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        onClick={
            () => navigate(`/admin-dashboard/department/${id}`)
        }
      >
        Edit
      </button>
      <button
        className="px-3 py-1 bg-red-600 text-white rounded shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
        onClick={() => handleDelete(id) }
      >
        Delete
      </button>
    </div>
  );
};

export { columns, DepartmentButtons };
