import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Unauthorized Component
 * This page is displayed when a user tries to access a protected route 
 * without the necessary permissions or authentication.
 */
const Unauthorized = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4 sm:p-6 md:p-8">
      <div className="bg-white p-6 sm:p-10 md:p-12 rounded-2xl shadow-xl text-center max-w-xs sm:max-w-md md:max-w-lg w-full transition-all duration-300 hover:shadow-2xl">
        {/* Error Code and Title */}
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-red-600 mb-2 sm:mb-4 tracking-tighter">401</h1>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 mb-4 sm:mb-6">Unauthorized Access</h2>
        
        <p className="text-sm sm:text-base md:text-lg text-slate-600 mb-6 sm:mb-10 leading-relaxed">
          You do not have permission to view this page. Please log in with appropriate credentials or contact support if you believe this is an error.
        </p>

        {/* Navigation link to redirect the user back to the login page */}
        <Link
          to="/login"
          className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3 sm:py-4 border border-transparent text-sm sm:text-base font-bold rounded-xl shadow-lg text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 transform hover:-translate-y-1"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;