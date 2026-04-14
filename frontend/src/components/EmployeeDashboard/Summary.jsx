import React from "react";
import { useAuthContext } from "../../context/authContext";
import { FaUser } from "react-icons/fa";

const Summary = () => {
  // Access the current logged-in user's information from the global AuthContext
  const { user } = useAuthContext();
  
  // Define a consistent theme color for the profile icon background
  const color = "bg-teal-500";

  return (
    <div className="bg-white p-5 sm:p-6 md:p-8 rounded-2xl shadow-lg flex items-center space-x-4 sm:space-x-6 transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 w-full max-w-xs sm:max-w-md md:max-w-lg">
      {/* Profile Icon Container */}
      <div
        className={`p-3.5 sm:p-4 md:p-5 rounded-full text-white ${color} shadow-md flex-shrink-0`}
      >
        <span className="text-xl sm:text-2xl md:text-3xl"><FaUser /></span>
      </div>

      {/* Welcome Message and User Name */}
      <div className="min-w-0">
        <p className="text-sm sm:text-base md:text-lg text-slate-500 font-medium">Welcome Back,</p>
        <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 tracking-tight truncate">
          {user?.name || 'Employee'}
        </p>
      </div>
    </div>
  );
};

export default Summary;
