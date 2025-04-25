import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectUser, loadUser, selectAuthLoading, selectToken } from '../../features/auth/authSlice'; // Removed selectIsAuthenticated for now

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-screen bg-black">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
    </div>
);

const ProtectedRoute = () => {
    const dispatch = useDispatch();
    const token = useSelector(selectToken); // Get token status directly
    const user = useSelector(selectUser);
    // Use a more specific loading flag if possible, or combine flags.
    // Let's track if loadUser specifically is running. We might need a dedicated state for this in authSlice.
    // For now, let's use the general isLoading flag combined with token/user status.
    const isLoadingAuth = useSelector(selectAuthLoading);
    const location = useLocation();

    useEffect(() => {
        // Attempt to load user only if we have a token but no user data,
        // and the auth slice isn't already busy (e.g., with login/register).
        if (token && !user && !isLoadingAuth) {
            console.log("Protected Route Effect: Token exists, user missing, not loading. Dispatching loadUser.");
            dispatch(loadUser());
        } else {
            // console.log("Protected Route Effect: Conditions not met for loadUser dispatch.", { token: !!token, user: !!user, isLoadingAuth });
        }
        // Dependency array needs careful consideration.
        // Re-running loadUser if token changes might be okay, but avoid loops.
    }, [token, user, isLoadingAuth, dispatch]);

    // --- Determine Loading State ---
    // We are definitely loading if the general auth slice says so.
    // We are also effectively loading if we have a token but are waiting for the user data.
    const isLoading = isLoadingAuth || (token && !user);

    if (isLoading) {
        console.log(`Protected Route Render: isLoading is true (isLoadingAuth: ${isLoadingAuth}, token: ${!!token}, user: ${!!user}). Showing spinner.`);
        // Show loading indicator while verifying auth/loading user data
        return <LoadingSpinner />;
    }

    // If loading is finished, the primary check is the presence of the token.
    if (!token) {
        console.log("Protected Route Render: isLoading is false, no token found. Redirecting to login.");
        // Not authenticated, redirect to login page
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If we have a token and loading is false, render the child route.
    // The loadUser thunk (if it ran and failed due to invalid token) would have dispatched logout,
    // causing 'token' to become null, triggering the redirect above on the next render.
    console.log("Protected Route Render: isLoading is false, token exists. Rendering outlet.");
    return <Outlet />;
};

export default ProtectedRoute;
