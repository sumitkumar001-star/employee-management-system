import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../context/authContext'


const PrivateRoutes = ({children}) => {
    const {user , loading} = useAuthContext()
    if(loading){
        return <div>Loading...</div>
    }
    return user ? children: <Navigate to='/login'/>
} 
export default PrivateRoutes