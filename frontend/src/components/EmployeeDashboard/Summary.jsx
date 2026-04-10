import React from "react";
import { useAuthContext } from "../../context/authContext";
import { FaUser } from "react-icons/fa";

const Summary = () => {
    const {user} = useAuthContext();
  const color = "bg-teal-500";
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg flex items-center space-x-6 transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 w-full max-w-lg">
      <div
        className={`p-5 rounded-full text-white ${color} shadow-md`}
      >
        <span className="text-3xl"><FaUser /></span>
      </div>
      <div>
        <p className="text-lg text-slate-500 font-medium">Welcome Back,</p>
        <p className="text-4xl font-bold text-slate-800 tracking-tight">{user.name}</p>
      </div>
    </div>
  );
};

export default Summary;
