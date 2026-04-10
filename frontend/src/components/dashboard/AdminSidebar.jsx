import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaBuilding,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaTachometerAlt,
  FaUsers,
  FaCogs,
} from "react-icons/fa";

const navLinks = [
  { to: "/admin-dashboard", icon: <FaTachometerAlt />, text: "Dashboard", end: true },
  { to: "/admin-dashboard/employees", icon: <FaUsers />, text: "Employee" },
  { to: "/admin-dashboard/departments", icon: <FaBuilding />, text: "Department" },
  { to: "/admin-dashboard/salary/add", icon: <FaMoneyBillWave />, text: "Salary" },
  { to: "/admin-dashboard/leaves", icon: <FaCalendarAlt />, text: "Leave" },
  { to: "/admin-dashboard/settings", icon: <FaCogs />, text: "Settings" },
];

const AdminSidebar = () => {
  const navLinkClass = ({ isActive }) =>
    `flex items-center space-x-3 rounded-md px-4 py-2.5 text-sm font-medium transition-colors duration-200 ease-in-out ${
      isActive
        ? "bg-blue-800 text-white shadow-sm"
        : "text-blue-100 hover:bg-blue-800 hover:text-white"
    }`;

  return (
    <aside className="bg-blue-900 text-white w-64 h-screen fixed left-0 top-0 flex flex-col border-r border-blue-800">
      <div className="bg-blue-900 h-16 flex items-center justify-center px-4 border-b border-blue-800">
        <h2 className="text-xl text-center font-extrabold tracking-tight text-white">ANDRITZ</h2>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
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

export default AdminSidebar;
