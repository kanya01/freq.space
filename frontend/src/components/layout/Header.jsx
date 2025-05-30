import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser, selectIsAuthenticated } from '../../features/auth/authSlice';

const Header = () => {
    const user = useSelector(selectUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    return (
        <header className="bg-floral-white/95 backdrop-blur-sm border-b border-timberwolf-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left side - Logo and navigation */}
                    <div className="flex items-center space-x-8">
                        <Link to="/" className="text-eerie-black font-bold text-xl">
                            freq.space
                        </Link>

                        <nav className="hidden md:flex space-x-6">
                            <Link
                                to="/hire"
                                className="text-black-olive-700 hover:text-eerie-black transition-colors duration-200 font-medium"
                            >
                                Hire a Service
                            </Link>
                            <Link
                                to="/sell"
                                className="text-black-olive-700 hover:text-eerie-black transition-colors duration-200 font-medium"
                            >
                                Sell a Service
                            </Link>
                        </nav>
                    </div>

                    {/* Right side - Auth */}
                    <div className="flex items-center">
                        {isAuthenticated && user ? (
                            <Link to="/profile" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                                {user.profile?.avatarUrl ? (
                                    <img
                                        src={user.profile.avatarUrl}
                                        alt={user.username}
                                        className="w-9 h-9 rounded-full object-cover ring-2 ring-timberwolf-300"
                                    />
                                ) : (
                                    <div className="w-9 h-9 bg-eerie-black text-floral-white rounded-full flex items-center justify-center font-medium">
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <span className="text-black-olive font-medium hidden sm:block">{user.username}</span>
                            </Link>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/login"
                                    className="text-black-olive-700 hover:text-eerie-black transition-colors duration-200 font-medium"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-eerie-black text-floral-white px-5 py-2.5 rounded-lg hover:bg-black-olive transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;