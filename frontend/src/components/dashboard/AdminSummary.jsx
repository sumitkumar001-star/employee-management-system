import React from "react";
import SummaryCard from "./SummaryCard";
import {
  FaBuilding,
  FaCheckCircle,
  FaFileAlt,
  FaHourglass,
  FaMoneyBill,
  FaUser,
  FaTimesCircle,
} from "react-icons/fa";

import { useEffect, useState } from "react";
import axios from "axios";

const AdminSummary = () => {
  // State to store the dashboard summary data (employees, departments, leaves, etc.)
  const [summary, setSummary] = useState(null);
  // State to track if the data is currently being fetched
  const [loading, setLoading] = useState(true);
  // State to store any error messages from the API call
  const [error, setError] = useState(null);

  // Fetch summary data from the backend when the component mounts
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get(
          "https://employee-management-system-wjrt.vercel.app/api/dashboard/summary", // Ensure this endpoint returns { totalEmployees, totalDepartments, totalSalary, leaveSummary: { appliedFor, approved, pending, rejected } }
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSummary(response.data);
      } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
          setError(error.response.data.error);
        } else {
          setError(error.message || "An error occurred");
        }
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  // Display a loading state while fetching data
  if (loading) {
    return (
              <div className="flex flex-col justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-4 border-teal-500 mb-4"></div>
          <div className="text-sm sm:text-lg md:text-xl font-semibold text-slate-500 tracking-wide animate-pulse">
            Loading....
          </div>
        </div>
    );
  }

  // Display an error message if the API call fails
  if (error) {
    return (
      <div className="flex justify-center items-center h-full text-red-600 font-bold text-xl">Error: {error}</div>
    );
  }

  // Fallback if no data is returned
  if (!summary) {
    return (
      <div className="flex justify-center items-center h-full font-bold text-xl">No Dashboard Data</div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-full">
      <h3 className="text-center text-2xl sm:text-3xl font-bold text-slate-700 tracking-tight">
        Admin Dashboard
      </h3>

      {/* General Statistics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
        <SummaryCard
          icon={<FaUser />}
          text="Total Employees"
          number={summary.totalEmployees || 0}
          color="bg-blue-500"
        />
        <SummaryCard
          icon={<FaBuilding />}
          text="Total Departments"
          number={summary.totalDepartments || 0}
          color="bg-sky-500"
        />
        <SummaryCard
          icon={<FaMoneyBill />}
          text="Monthly Salary"
          number={summary.totalSalary || 0}
          color="bg-emerald-500"
        />
      </div>

      {/* Leave Statistics Section */}
      <div className="mt-8 sm:mt-12">
        <h3 className="text-center text-2xl sm:text-3xl font-bold text-slate-700 tracking-tight">
          Leave Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mt-6 sm:mt-8">
          <SummaryCard
            icon={<FaFileAlt />}
            text="Leave Applied"
            number={summary.leaveSummary?.appliedFor || 0}
            color="bg-indigo-500"
          />
          <SummaryCard
            icon={<FaCheckCircle />}
            text="Leave Approved"
            number={summary.leaveSummary?.approved || 0}
            color="bg-green-500"
          />
          <SummaryCard
            icon={<FaHourglass />}
            text="Leave Pending"
            number={summary.leaveSummary?.pending || 0}
            color="bg-yellow-500"
          />
          <SummaryCard
            icon={<FaTimesCircle />}
            text="Leave Rejected"
            number={summary.leaveSummary?.rejected || 0}
            color="bg-red-500"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminSummary;
