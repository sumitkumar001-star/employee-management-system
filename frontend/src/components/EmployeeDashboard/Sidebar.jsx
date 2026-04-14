import React from "react";
import { NavLink } from "react-router-dom";
import { useAuthContext } from "../../context/authContext";
import {
  FaCalendarAlt,
  FaMoneyBillWave,
  FaTachometerAlt,
  FaUsers,
  FaCogs,
} from "react-icons/fa";

const Sidebar = () => {
  /**
   * Helper function to handle active/inactive styling for NavLinks.
   * React Router's NavLink provides an 'isActive' boolean in its className callback.
   * @param {Object} params - Contains isActive boolean
   */
  const navLinkClass = ({ isActive }) =>
    `flex items-center space-x-3 rounded-md px-4 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out ${
      isActive
        ? "bg-teal-500 text-white shadow-inner"
        : "text-blue-100 hover:bg-blue-700 hover:text-white hover:pl-5"
    }`;
  const { user } = useAuthContext();

  // Configuration for sidebar navigation items to keep the component clean and maintainable
  const navLinks = [
    { to: "/employee-dashboard", icon: <FaTachometerAlt />, text: "Dashboard", end: true },
    { to: `/employee-dashboard/profile/${user._id}`, icon: <FaUsers />, text: "My Profile" },
    { to: "/employee-dashboard/leaves", icon: <FaCalendarAlt />, text: "Leaves" },
    { to: `/employee-dashboard/salary/${user._id}`, icon: <FaMoneyBillWave />, text: "Salary" },
    { to: "/employee-dashboard/settings", icon: <FaCogs />, text: "Settings" },
  ];

  return (
    <aside className="bg-blue-800 text-white w-16 sm:w-20 md:w-56 lg:w-64 h-screen fixed left-0 top-0 flex flex-col border-r border-blue-700 transition-all duration-300 ease-in-out z-50">
      {/* Sidebar Header / Logo Section */}
      <div className="bg-blue-900 h-16 flex items-center justify-center px-2 md:px-4 border-b border-blue-700">
        <h2 className="text-sm sm:text-base md:text-xl lg:text-2xl text-center font-extrabold tracking-tight text-white truncate">ANDRITZ</h2>
      </div>
      <nav className="flex-1 px-2 md:px-4 py-6 space-y-2 overflow-y-auto">
        {/* Map through the navLinks array to generate navigation items dynamically */}
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={navLinkClass}
          >
            <span className="text-xl md:text-lg w-full md:w-6 flex items-center justify-center">
              {link.icon}
            </span>
            <span className="hidden md:block truncate">{link.text}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
