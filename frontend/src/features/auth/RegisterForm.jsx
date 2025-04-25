// frontend/src/features/auth/RegisterForm.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register, clearError, selectAuthError, selectAuthLoading, selectIsAuthenticated, selectUser } from './authSlice';

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

    const isLoading = useSelector(selectAuthLoading);
    const authError = useSelector(selectAuthError);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectUser);

    // Redirect after successful registration
    useEffect(() => {
        if (isAuthenticated && user && !user.profile?.onboardingCompleted) {
            navigate('/onboarding');
        } else if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, user, navigate]);

    // Clear errors when component unmounts
    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const onChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));

        // Clear password error when user types
        if (e.target.name === 'password' || e.target.name === 'confirmPassword') {
            setPasswordError('');
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setPasswordError('');

        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }

        dispatch(register({ username, email, password }));
    };

    return (
        <form onSubmit={onSubmit} className="bg-gray-900 p-8 rounded-lg shadow-lg space-y-6">
            {authError && !passwordError && (
                <div className="p-3 bg-red-900 border border-red-700 rounded-md">
                    <p className="text-sm text-red-100">{authError}</p>
                </div>
            )}

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