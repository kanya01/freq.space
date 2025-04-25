// frontend/src/components/common/ProtectedRoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectIsAuthenticated, selectAuthLoading } from '../../features/auth/authSlice';

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-screen bg-black">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
    </div>
);

const ProtectedRoute = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const isLoading = useSelector(selectAuthLoading);
    const location = useLocation();

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;