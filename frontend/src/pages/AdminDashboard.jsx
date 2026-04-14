import React from 'react'
import AdminSidebar from '../components/dashboard/AdminSidebar'
import Navbar from '../components/dashboard/Navbar'
import AdminSummary from '../components/dashboard/AdminSummary'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuthContext } from '../context/authContext'
                     
export const AdminDashboard = () => {      
  // Access authentication state and user data from the global AuthContext
  const {user, isAuthenticated, loading} = useAuthContext()

  // Show a loading indicator while the authentication status is being verified
  if(loading){
    return <div>Loading...</div>
  }

  // Redirect to login if the user is not authenticated or does not have the 'admin' role
  if(!isAuthenticated || !user || user.role !== 'admin'){
    return <Navigate to="/login" />
  }
                        
  return (
    <div className='flex'>
        {/* Sidebar navigation specific to Admin tasks */}
        <AdminSidebar />
        
        <div className='flex-1 ml-16 sm:ml-20 md:ml-56 lg:ml-64 bg-gray-100 min-h-screen transition-all duration-300 ease-in-out'>
        {/* Top navigation bar showing user info and logout */}
        <Navbar />
        {/* Outlet renders the matched child route component (e.g., AdminSummary, EmployeeList) */}
        <div className="p-0"><Outlet /></div>
        </div>                                

    </div>
  )
}
export default AdminDashboard