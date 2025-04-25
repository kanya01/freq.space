// frontend/src/features/auth/RegisterForm.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register, reset, selectAuthError, selectAuthLoading, selectIsAuthenticated } from './authSlice'; // Assuming selectors are exported

function RegisterForm() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [passwordError, setPasswordError] = useState('');

    const { username, email, password, confirmPassword } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Select state from Redux store
    const isLoading = useSelector(selectAuthLoading);
    const authError = useSelector(selectAuthError); // Get specific auth error message
    const isAuthenticated = useSelector(selectIsAuthenticated);

    // Reset Redux auth state on component mount/unmount
    useEffect(() => {
        // Reset error/loading state when component mounts
        dispatch(reset());
        // Optional: Reset state when component unmounts
        // return () => {
        //   dispatch(reset());
        // }
    }, [dispatch]);

    // Redirect if registration is successful
    useEffect(() => {
        if (isAuthenticated) {
            // Registration successful, redirect to home or profile page
            navigate('/'); // Or '/profile' or a welcome page
        }
    }, [isAuthenticated, navigate]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
        // Clear password mismatch error when user types
        if (e.target.name === 'password' || e.target.name === 'confirmPassword') {
            setPasswordError('');
        }
        // Clear global auth error when user starts typing in any field
        if(authError) {
            dispatch(reset()); // Reset Redux error state
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setPasswordError(''); // Clear previous password error
        dispatch(reset()); // Clear previous global auth errors

        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match');
        } else {
            const userData = {
                username,
                email,
                password,
                // Add onboarding fields here if collected at registration
            };
            dispatch(register(userData));
        }
    };

    return (
        <form onSubmit={onSubmit} className="bg-gray-900 p-8 rounded-lg shadow-lg space-y-6">
            {/* Display global authentication errors from Redux */}
            {authError && !passwordError && ( // Show authError only if no password mismatch error
                <div className="p-3 bg-red-900 border border-red-700 rounded-md">
                    <p className="text-sm text-red-100">{authError}</p>
                </div>
            )}
            {/* Display password mismatch error */}
            {passwordError && (
                <div className="p-3 bg-red-900 border border-red-700 rounded-md">
                    <p className="text-sm text-red-100">{passwordError}</p>
                </div>
            )}

            <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                    Username
                </label>
                <input
                    type="text"
                    name="username"
                    id="username"
                    value={username}
                    onChange={onChange}
                    required
                    className="block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="Choose a username"
                />
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email address
                </label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={onChange}
                    required
                    className="block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="you@example.com"
                />
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                    Password
                </label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={onChange}
                    required
                    minLength="6"
                    className="block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="••••••••"
                />
            </div>

            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                    Confirm Password
                </label>
                <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={onChange}
                    required
                    minLength="6"
                    className="block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="••••••••"
                />
            </div>

            {/* Add Onboarding fields here later if needed (Experience Level, Skills) */}

            <div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
            </div>
        </form>
    );
}

export default RegisterForm;