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
  const navLinkClass = ({ isActive }) =>
    `flex items-center space-x-3 rounded-md px-4 py-2.5 text-sm font-medium transition-colors duration-200 ease-in-out ${
      isActive
        ? "bg-teal-500 text-white shadow-inner"
        : "text-blue-100 hover:bg-blue-700 hover:text-white"
    }`;
  const { user } = useAuthContext();

  const navLinks = [
    { to: "/employee-dashboard", icon: <FaTachometerAlt />, text: "Dashboard", end: true },
    { to: `/employee-dashboard/profile/${user._id}`, icon: <FaUsers />, text: "My Profile" },
    { to: "/employee-dashboard/leaves", icon: <FaCalendarAlt />, text: "Leaves" },
    { to: `/employee-dashboard/salary/${user._id}`, icon: <FaMoneyBillWave />, text: "Salary" },
    { to: "/employee-dashboard/settings", icon: <FaCogs />, text: "Settings" },
  ];

  return (
    <aside className="bg-blue-800 text-white w-64 h-screen fixed left-0 top-0 flex flex-col">
      <div className="bg-blue-900 h-16 flex items-center justify-center px-4 shadow-lg">
        <h2 className="text-2xl text-center font-bold tracking-wider">ANDRITZ</h2>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={navLinkClass}
          >
            <span className="text-lg w-6 flex items-center justify-center">
              {link.icon}
            </span>
            <span>{link.text}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
