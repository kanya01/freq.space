// frontend/src/features/profile/components/ProfileView.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../auth/authSlice';
import ProfileHeader from './ProfileHeader';
import ProfileAbout from './ProfileAbout';
import ProfileServices from './ProfileServices';
import ProfilePortfolio from './ProfilePortfolio';
import ProfileReviews from './ProfileReviews';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import { HomeIcon } from '@heroicons/react/24/outline';

const ProfileView = ({ user, isOwnProfile = false }) => {
    const currentUser = useSelector(selectUser);
    const [activeSection, setActiveSection] = useState('about');

    return (
        <div className="min-h-screen bg-floral-white">
            <Header />

            {/* Hero Section with Subtle Gradient */}
            <section className="relative overflow-hidden bg-gradient-to-b from-floral-white to-timberwolf-100 pb-12">
                {/* Decorative elements matching seller page */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-flame-900 rounded-full filter blur-3xl opacity-5 translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-timberwolf-300 rounded-full filter blur-3xl opacity-10 -translate-x-1/2 translate-y-1/2"></div>

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center space-x-2 text-sm text-black-olive-600 mb-6">
                        <Link to="/" className="hover:text-eerie-black transition-colors">
                            <HomeIcon className="h-4 w-4" />
                        </Link>
                        <span>/</span>
                        <Link to="/sellers" className="hover:text-eerie-black transition-colors">
                            Professionals
                        </Link>
                        <span>/</span>
                        <span className="text-eerie-black font-medium">{user.username}</span>
                    </nav>

                    {/* Profile Header */}
                    <ProfileHeader user={user} isOwnProfile={isOwnProfile} />
                </div>
            </section>

            {/* Main Content - Two Column Layout */}
            <section className="bg-timberwolf-100 py-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - About & Skills */}
                        <div className="lg:col-span-1 space-y-6">
                            <ProfileAbout user={user} />
                        </div>

                        {/* Right Column - Services & Portfolio */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Services Section */}
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-eerie-black">Services</h2>
                                    {isOwnProfile && (
                                        <button className="text-flame-600 hover:text-flame-700 text-sm font-medium transition-colors">
                                            + Add Service
                                        </button>
                                    )}
                                </div>
                                <ProfileServices user={user} isOwnProfile={isOwnProfile} />
                            </div>

                            {/* Portfolio Section */}
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-eerie-black">Portfolio</h2>
                                    {isOwnProfile && (
                                        <Link
                                            to="/upload"
                                            className="text-flame-600 hover:text-flame-700 text-sm font-medium transition-colors"
                                        >
                                            + Upload Content
                                        </Link>
                                    )}
                                </div>
                                <ProfilePortfolio userId={user.userId} isOwnProfile={isOwnProfile} />
                            </div>

                            {/* Reviews Section */}
                            <div>
                                <h2 className="text-2xl font-bold text-eerie-black mb-6">
                                    Reviews ({user.reviews?.length || 656})
                                </h2>
                                <ProfileReviews user={user} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default ProfileView;