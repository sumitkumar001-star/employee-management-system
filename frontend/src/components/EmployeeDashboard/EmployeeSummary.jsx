import React from 'react';
import Summary from './Summary';

const EmployeeSummary = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-full">
      {/* Header section providing context to the employee */}
      <div className="text-center mb-12">
        <h3 className="text-4xl font-extrabold text-slate-800 tracking-tight">
          Employee Dashboard
        </h3>
        <p className="mt-2 text-lg text-slate-600">Here's a quick overview of your account.</p>
      </div>

      <div className='flex justify-center'>
        {/* The Summary component displays the user's welcome message and profile icon */}
        <Summary />
      </div>
    </div>
  );
};

export default EmployeeSummary;