// frontend/src/components/layout/NavBar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, selectUser } from '../../features/auth/authSlice';

const NavBar = () => {
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const location = useLocation();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Determine active link
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="border-b border-gray-800 bg-black/90 backdrop-blur-sm">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-blue-500 font-medium text-lg">
                            freq.space
                        </Link>
                    </div>

                    {/* Main Navigation */}
                    <div className="flex space-x-4">
                        <Link
                            to="/"
                            className={`px-3 py-1 rounded-md text-sm ${
                                isActive('/')
                                    ? 'text-white'
                                    : 'text-gray-400 hover:text-gray-200'
                            }`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/discover"
                            className={`px-3 py-1 rounded-md text-sm ${
                                isActive('/discover')
                                    ? 'text-white'
                                    : 'text-gray-400 hover:text-gray-200'
                            }`}
                        >
                            Discover
                        </Link>
                        <Link
                            to="/upload"
                            className={`px-3 py-1 rounded-md text-sm ${
                                isActive('/upload')
                                    ? 'text-white'
                                    : 'text-gray-400 hover:text-gray-200'
                            }`}
                        >
                            Upload
                        </Link>
                    </div>

                    {/* Right section - Upload button & user profile */}
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/upload"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm"
                        >
                            Upload Track
                        </Link>

                        {/* User Avatar */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                className="flex items-center focus:outline-none"
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-800">
                                    {user?.profile?.avatarUrl ? (
                                        <img
                                            src={user.profile.avatarUrl}
                                            alt={user.username}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center">
                      <span className="text-white text-sm">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                      </span>
                                        </div>
                                    )}
                                </div>
                            </button>

                            {/* Dropdown menu */}
                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-48 py-1 bg-gray-900 border border-gray-800 rounded-md shadow-lg z-50">
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        Your Profile
                                    </Link>
                                    <Link
                                        to="/profile/edit"
                                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        Settings
                                    </Link>
                                    <button
                                        onClick={() => {
                                            dispatch(logout());
                                            setShowDropdown(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;