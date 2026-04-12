import React from 'react'
import Sidebar from '../components/EmployeeDashboard/Sidebar'
import {Outlet} from 'react-router-dom'
import Navbar from '../components/dashboard/Navbar'

const EmployeeDashboard = () => {
  return (
    /* Main layout container using flexbox to align Sidebar and Content */
    <div className='flex'>
        {/* Sidebar navigation specific to Employee tasks */}
        <Sidebar />
        
        <div className='flex-1 ml-64 bg-gray-100 h-screen'>
        {/* Top navigation bar showing user info and logout */}
        <Navbar />
        {/* Outlet renders the matched child route component (e.g., EmployeeSummary, Profile, Leaves) */}
        <Outlet />              
        </div>                                
    </div>
  )
}

export default EmployeeDashboard