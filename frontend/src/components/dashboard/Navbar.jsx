import React from 'react'
import { useAuthContext } from '../../context/authContext'

const Navbar = () => {
  const {user, logout} = useAuthContext();
  return (
    <div className='flex justify-between h-16 bg-blue-900 text-white items-center px-6 shadow-lg'>
        <p className="text-xl font-medium">Welcome</p>
        <button
          className="px-4 py-2 bg-red-700 text-white rounded-md shadow-sm hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
          onClick={logout} // Replace with actual logout logic
        >
          Logout
        </button>

    </div>
  )
}

export default Navbar 