// frontend/src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loadUser } from './features/auth/authSlice';
import Layout from './components/layout/Layout';
import OnboardingFlow from './features/onboarding/OnboardingFlow';

// Pages
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import PublicProfilePage from './pages/PublicProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import SellersPage from './pages/SellersPage';
import TrackDetailPage from './pages/TrackDetailPage';
import UploadContentPage from './pages/UploadContentPage';

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
                {/* Public Routes - No layout */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Public Routes - With layout */}
                <Route path="/tracks/:id" element={
                    <Layout>
                        <TrackDetailPage />
                    </Layout>
                } />
                <Route path="/u/:username" element={

                        <PublicProfilePage />

                } />
                <Route path="/sellers" element={
                    <SellersPage />
                } />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={
                        <HomePage />
                    } />
                    <Route path="/profile" element={

                            <ProfilePage />

                    } />
                    <Route path="/onboarding" element={<OnboardingFlow />} />
                    <Route path="/profile/edit" element={
                        <Layout>
                            <EditProfilePage />
                        </Layout>
                    } />
                    <Route path="/upload" element={
                        <Layout>
                            <UploadContentPage />
                        </Layout>
                    } />
                    <Route path="/tracks/:id/edit" element={
                        <Layout>
                            <UploadContentPage />
                        </Layout>
                    } />
                </Route>

                {/* 404 Not Found */}
                <Route path="*" element={
                    <Layout>
                        <div className="flex items-center justify-center min-h-screen">
                            <div className="text-center">
                                <h1 className="text-4xl font-bold mb-4">404</h1>
                                <p className="text-xl">Page not found</p>
                            </div>
                        </div>
                    </Layout>
                } />
            </Routes>
        </Router>
    );
}

export default App;