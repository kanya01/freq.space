// frontend/src/features/auth/LoginForm.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { login, clearError, selectAuthError, selectAuthLoading, selectIsAuthenticated } from './authSlice';

function LoginForm() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const isLoading = useSelector(selectAuthLoading);
    const authError = useSelector(selectAuthError);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    // Redirect after successful login
    useEffect(() => {
        if (isAuthenticated) {
            // Get the previous location from navigation state or default to home
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, location]);

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
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        dispatch(login({ email, password }));
    };

    return (
        <form onSubmit={onSubmit} className="bg-gray-900 p-8 rounded-lg shadow-lg space-y-6">
            {authError && (
                <div className="p-3 bg-red-900 border border-red-700 rounded-md">
                    <p className="text-sm text-red-100">{authError}</p>
                </div>
            )}

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
                    autoComplete="email"
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
                    autoComplete="current-password"
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
                    {isLoading ? 'Logging In...' : 'Log In'}
                </button>
            </div>
        </form>
    );
}

export default LoginForm;