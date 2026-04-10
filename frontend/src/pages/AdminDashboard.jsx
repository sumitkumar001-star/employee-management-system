import React from 'react'
import AdminSidebar from '../components/dashboard/AdminSidebar'
import Navbar from '../components/dashboard/Navbar'
import AdminSummary from '../components/dashboard/AdminSummary'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuthContext } from '../context/authContext'
                     
export const AdminDashboard = () => {      
  const {user, isAuthenticated, loading} = useAuthContext()

  if(loading){
    return <div>Loading...</div>
  }

  if(!isAuthenticated || !user || user.role !== 'admin'){
    return <Navigate to="/login" />
  }
                        
  return (
    <div className='flex'>
        <AdminSidebar />
        
        <div className='flex-1 ml-64 bg-gray-100 h-screen'>
        <Navbar />
        <Outlet />              
        </div>                                

    </div>
  )
}
export default AdminDashboard