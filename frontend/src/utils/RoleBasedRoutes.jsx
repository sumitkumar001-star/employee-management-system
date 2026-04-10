import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../context/authContext'


const RoleBasedRoutes = ({children, requiredRole}) => {
    const {user, isAuthenticated, loading} = useAuthContext()
    if(loading){
        return <div>Loading...</div>
    }

    if(!user){
        return <Navigate to='/login'/>
    }

    if(!requiredRole.includes(user.role)){
        return <Navigate to='/unauthorized'/>
    }
    return children;
}
export default RoleBasedRoutes
