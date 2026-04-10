import React from "react";

const SummaryCard = ({ icon, text, number, color }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md flex items-center space-x-4 transition-transform transform hover:-translate-y-1 hover:shadow-lg">
      <div
        className={`p-4 rounded-full text-white ${color}`}
      >
        <span className="text-2xl">{icon}</span>
      </div>
      <div>
        <p className="text-slate-500 font-medium">{text}</p>
        <p className="text-3xl font-bold text-slate-800">{number}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
