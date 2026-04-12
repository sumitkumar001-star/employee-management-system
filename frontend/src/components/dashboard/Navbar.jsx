import React from 'react'
import { useAuthContext } from '../../context/authContext'

const Navbar = () => {
  // Access the current user and logout function from the AuthContext
  const { user, logout } = useAuthContext();

  return (
    <div className='flex justify-between h-16 bg-blue-900 text-white items-center px-6 shadow-lg'>
        {/* Display a welcome message with the user's name if available */}
        <p className="text-xl font-medium">Welcome, {user?.name || 'User'}</p>

        {/* Logout button that triggers the logout logic from context */}
        <button
          className="px-4 py-2 bg-red-700 text-white rounded-md shadow-sm hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
          onClick={logout}
        >
          Logout
        </button>

    </div>
  )
}

export default Navbar 