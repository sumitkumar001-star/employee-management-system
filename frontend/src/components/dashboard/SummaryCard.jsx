import React from "react";

/**
 * SummaryCard Component
 * A reusable UI component used in the dashboard to display key metrics.
 * 
 * @param {ReactNode} icon - The icon component to display (e.g., from react-icons)
 * @param {string} text - The label describing the metric (e.g., "Total Employees")
 * @param {number|string} number - The actual value/statistic to display
 * @param {string} color - Tailwind CSS background color class for the icon container
 */
const SummaryCard = ({ icon, text, number, color }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md flex items-center space-x-4 transition-transform transform hover:-translate-y-1 hover:shadow-lg">
      {/* Icon Container: Uses the dynamic color prop for the background */}
      <div
        className={`p-4 rounded-full text-white ${color}`}
      >
        <span className="text-2xl">{icon}</span>
      </div>
      {/* Text Content: Displays the label and the numeric value */}
      <div>
        <p className="text-slate-500 font-medium">{text}</p>
        <p className="text-3xl font-bold text-slate-800">{number}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
