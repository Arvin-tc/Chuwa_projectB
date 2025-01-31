import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AuthProtect = ({ children, role }) => {
    const currentRole = useSelector((state)=>state.auth.role);
    const userRole = currentRole || localStorage.getItem('userRole');

    if (!userRole) {
        return <Navigate to="/login" replace/>;
    }



    if (role && userRole !== role && userRole == 'hr') {
        return <Navigate to="/hr-management" replace/>;
    }

    if (role && userRole !== role && userRole == 'employee') {
        return <Navigate to="/onboarding" replace/>;
    }

    return children;
};


export default AuthProtect;