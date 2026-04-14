import React from 'react'
import { useAuthContext } from '../../context/authContext'

const Navbar = () => {
  // Access the current user and logout function from the AuthContext
  const { user, logout } = useAuthContext();

  return (
    <div className='flex justify-between h-16 bg-blue-900 text-white items-center px-4 sm:px-6 lg:px-8 shadow-lg'>
        {/* Display a welcome message with the user's name if available */}
        <p className="text-base sm:text-lg md:text-xl font-medium truncate mr-2">Welcome, {user?.name || 'User'}</p>

        {/* Logout button that triggers the logout logic from context */}
        <button
          className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-red-700 text-white rounded-md shadow-sm hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 whitespace-nowrap"
          onClick={logout}
        >
          Logout
        </button>

    </div>
  )
}

export default Navbar 