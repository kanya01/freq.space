// frontend/src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loadUser } from './features/auth/authSlice';
import OnboardingFlow from './features/onboarding/OnboardingFlow';

// Pages
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';

// Components
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
    const dispatch = useDispatch();

    // Check authentication status on app load
    useEffect(() => {
        dispatch(loadUser());
    }, [dispatch]);

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/onboarding" element={<OnboardingFlow />} />
                </Route>

                {/* 404 Not Found */}
                <Route path="*" element={<div className="text-white">404 Not Found</div>} />
            </Routes>
        </Router>
    );
}

export default App;