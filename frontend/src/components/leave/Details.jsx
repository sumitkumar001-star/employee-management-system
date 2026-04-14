import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DataTables from "react-data-table-component";
const Details = () => {
  const { id } = useParams();
  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const fetchLeaveDetails = async () => {
    try {
      
      setLoading(true); // Ensure loading is true before fetch
      const response = await axios.get(`https://employee-management-system-wjrt.vercel.app/api/leave/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        // Update state with the specific leave object from the response
        setLeave(response.data.leave);
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        // Display specific error from backend
        setLeave(null); // Clear leave state on error
        alert(error.response.data.error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveDetails();
  }, []);

  const changeStatus = async (status) => {
    try {
      const response = await axios.put(
        `https://employee-management-system-wjrt.vercel.app/api/leave/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        navigate("/admin-dashboard/leaves");
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    }
  };



  return (
    <div className="bg-slate-50 min-h-full p-4 sm:p-6 lg:p-8">
      {loading ? (
        <div className="flex flex-col justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-teal-500 mb-4"></div>
          <div className="text-xl font-semibold text-slate-500 tracking-wide">
            Loading Leave Details...
          </div>
        </div>
      ) : leave ? (
        <div className="max-w-4xl mx-auto my-4 md:my-10 bg-white p-4 md:p-8 rounded-xl shadow-lg border border-slate-100">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-8 text-center tracking-tight">
            Leave Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex flex-col items-center justify-start space-y-6">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <img
                  src={leave.employeeId.userId.profilePicture}
                  alt="Profile"
                  className="relative rounded-full border-4 border-white w-40 h-40 md:w-56 md:h-56 object-cover shadow-2xl"
                />
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-800">{leave.employeeId.userId.name}</p>
                <p className="text-teal-600 font-semibold uppercase tracking-wider text-sm">{leave.employeeId.department.dep_name}</p>
              </div>
            </div>
            
            <div className="space-y-5 bg-slate-50 p-4 md:p-6 rounded-2xl border border-slate-100">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Employee ID</p>
                <p className="text-lg font-semibold text-slate-800">{leave.employeeId.employeeId}</p>
              </div>
              
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Leave Type</p>
                <p className="text-lg font-semibold text-teal-700">{leave.leaveType}</p>
              </div>

              <div className="flex flex-col space-y-1 border-b border-slate-200 pb-2">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Reason</p>
                <p className="text-md font-medium text-slate-700 italic">"{leave.reason}"</p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b border-slate-200 pb-2">
                <div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Start Date</p>
                  <p className="text-md font-semibold text-slate-800">
                    {new Date(leave.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">End Date</p>
                  <p className="text-md font-semibold text-slate-800">
                    {new Date(leave.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Current Status</p>
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border shadow-sm ${
                    leave.status === "Approved"
                      ? "bg-green-100 text-green-700 border-green-300"
                      : leave.status === "Rejected"
                      ? "bg-red-100 text-red-700 border-red-300"
                      : "bg-yellow-100 text-yellow-700 border-yellow-300"
                  }`}
                >
                  {leave.status}
                </span>
              </div>

              {leave.status === "Pending" && (
                <div className="flex space-x-4 mt-8 pt-4">
                  <button
                    onClick={() => changeStatus("Approved")}
                    className="flex-1 px-6 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-all duration-200 shadow-lg hover:shadow-teal-200 transform hover:-translate-y-0.5"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => changeStatus("Rejected")}
                    className="flex-1 px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all duration-200 shadow-lg hover:shadow-red-200 transform hover:-translate-y-0.5"
                  >
                    Reject
                  </button>
                </div>
              )}
              
              <button
                onClick={() => navigate("/admin-dashboard/leaves")}
                className="w-full mt-4 px-6 py-2 text-slate-500 font-semibold hover:text-slate-800 transition-colors text-sm"
              >
                Back to List
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Details;