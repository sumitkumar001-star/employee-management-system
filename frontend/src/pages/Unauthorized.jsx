import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Unauthorized Component
 * This page is displayed when a user tries to access a protected route 
 * without the necessary permissions or authentication.
 */
const Unauthorized = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
        {/* Error Code and Title */}
        <h1 className="text-5xl font-extrabold text-red-600 mb-4">401</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Unauthorized Access</h2>
        
        <p className="text-gray-600 mb-8">
          You do not have permission to view this page. Please log in with appropriate credentials or contact support if you believe this is an error.
        </p>

        {/* Navigation link to redirect the user back to the login page */}
        <Link
          to="/login"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;