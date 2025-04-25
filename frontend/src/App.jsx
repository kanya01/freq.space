// frontend/src/App.jsx
import React, { useEffect } from 'react'; // Import useEffect
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; // Import hooks
import { loadUser, selectToken } from './features/auth/authSlice'; // Import action and selector

// Pages
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
// Import placeholder pages for protected routes
import HomePage from './pages/HomePage'; // Assume HomePage needs login for now
import ProfilePage from './pages/ProfilePage'; // Assume ProfilePage needs login

// Common Components
import ProtectedRoute from './components/common/ProtectedRoute'; // Import ProtectedRoute
// import Navbar from './components/layout/Navbar'; // Example Navbar import

// Create placeholder pages if they don't exist
// src/pages/HomePage.jsx
// const HomePage = () => <div className="text-white">Welcome to freq.space! (Protected Home)</div>;
// src/pages/ProfilePage.jsx
// const ProfilePage = () => <div className="text-white">Your Profile (Protected)</div>;
// Make sure these files exist or create simple versions like above


function App() {
    const dispatch = useDispatch();
    // Check if token exists on initial load (from localStorage via initial state)
    const token = useSelector(selectToken); // Assuming you add a simple token selector

    useEffect(() => {
        // If a token exists in the initial state but user data is not loaded, try loading user
        // This effect runs once when the app mounts
        if (token) {
            // console.log("App Mount: Token found, dispatching loadUser.");
            dispatch(loadUser());
        }
    }, [dispatch, token]); // Dependency array includes dispatch and token

    return (
        <Router>
            {/* <Navbar /> */} {/* Add Navbar later */}
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}> {/* Wrap protected routes */}
                    {/* Add routes that require login inside here */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    {/* Add other protected routes like /settings, /dashboard etc. */}
                </Route>

                {/* Optional: 404 Not Found Route */}
                <Route path="*" element={<div className="text-white">404 Not Found</div>} />

            </Routes>
            {/* Footer might go here */}
        </Router>
    );
}

export default App;

// --- Add selector to authSlice.js ---
// export const selectToken = (state) => state.auth.token;