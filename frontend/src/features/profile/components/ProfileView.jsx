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
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const ProfileView = ({ user, isOwnProfile = false }) => {
    const currentUser = useSelector(selectUser);
    const [activeSection, setActiveSection] = useState('about');
    const showUploadButton = isOwnProfile && currentUser && currentUser._id === user?._id;

    // Handle section navigation
    const scrollToSection = (sectionId) => {
        setActiveSection(sectionId);
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Update active section based on scroll position
    useEffect(() => {
        const handleScroll = () => {
            const sections = ['about', 'services', 'portfolio', 'reviews'];
            const current = sections.find(section => {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    return rect.top <= 100 && rect.bottom >= 100;
                }
                return false;
            });

            if (current) {
                setActiveSection(current);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Elegant Navbar */}
            <header className="fixed top-0 inset-x-0 bg-black/95 z-50 border-b border-gray-900">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Link to="/" className="text-xl font-medium text-blue-500">
                                freq.space
                            </Link>
                        </div>

                        <nav className="hidden md:flex space-x-8">
                            <button
                                onClick={() => scrollToSection('about')}
                                className={`px-3 py-2 text-sm font-medium ${
                                    activeSection === 'about'
                                        ? 'text-white border-b border-blue-500'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                About
                            </button>
                            <button
                                onClick={() => scrollToSection('services')}
                                className={`px-3 py-2 text-sm font-medium ${
                                    activeSection === 'services'
                                        ? 'text-white border-b border-blue-500'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                Services
                            </button>
                            <button
                                onClick={() => scrollToSection('portfolio')}
                                className={`px-3 py-2 text-sm font-medium ${
                                    activeSection === 'portfolio'
                                        ? 'text-white border-b border-blue-500'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                Portfolio
                            </button>
                            <button
                                onClick={() => scrollToSection('reviews')}
                                className={`px-3 py-2 text-sm font-medium ${
                                    activeSection === 'reviews'
                                        ? 'text-white border-b border-blue-500'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                Reviews
                            </button>
                        </nav>

                        <div className="flex items-center">
                            <div className="relative mr-4">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="w-48 bg-gray-900 rounded-full px-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                            </div>

                            {showUploadButton && (
                                <Link
                                    to="/upload"
                                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded-md"
                                >
                                    <PlusIcon className="h-4 w-4 mr-1" />
                                    Upload Track
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <div className="pt-24">
                {/* Main Content Container */}
                <div className="max-w-6xl mx-auto px-4">
                    {/* User Profile Header */}
                    <ProfileHeader user={user} isOwnProfile={isOwnProfile} />

                    {/* About Section */}
                    <section id="about" className="mt-16 mb-24">
                        <h2 className="text-xl font-medium mb-6 pb-1 border-b border-gray-900">About</h2>
                        <ProfileAbout user={user} />
                    </section>

                    {/* Services Section */}
                    <section id="services" className="mb-24">
                        <h2 className="text-xl font-medium mb-6 pb-1 border-b border-gray-900">Services</h2>
                        <ProfileServices user={user} isOwnProfile={isOwnProfile} />
                    </section>

                    {/* Portfolio Section */}
                    <section id="portfolio" className="mb-24">
                        <div className="flex justify-between items-center mb-6 pb-1 border-b border-gray-900">
                            <h2 className="text-xl font-medium">Portfolio</h2>
                            {showUploadButton && (
                                <Link
                                    to="/upload"
                                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded-md"
                                >
                                    <PlusIcon className="h-4 w-4 mr-1" />
                                    Upload Track
                                </Link>
                            )}
                        </div>
                        <ProfilePortfolio user={user} isOwnProfile={isOwnProfile} />
                    </section>

                    {/* Reviews Section */}
                    <section id="reviews" className="mb-24">
                        <h2 className="text-xl font-medium mb-6 pb-1 border-b border-gray-900">Reviews</h2>
                        <ProfileReviews user={user} />
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;