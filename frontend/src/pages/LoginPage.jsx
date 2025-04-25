// frontend/src/pages/LoginPage.jsx
import React from 'react';
import LoginForm from '../features/auth/LoginForm'; // We'll create this next
import { Link } from 'react-router-dom';

function LoginPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-gray-100 px-4 py-12">
            <div className="w-full max-w-md">
                {/* Optional: Add Logo or App Name Header */}
                <h1 className="text-3xl font-bold text-center text-white mb-8">
                    Log in to freq.space
                </h1>

                <LoginForm />

                <p className="mt-8 text-center text-sm text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-white hover:text-gray-300 underline">
                        Sign up
                    </Link>
                </p>
                {/* Optional: Add Forgot Password link later */}
                {/* <p className="mt-2 text-center text-sm text-gray-400">
                    <Link to="/forgot-password" className="font-medium text-white hover:text-gray-300 underline">
                        Forgot password?
                    </Link>
                </p> */}
            </div>
        </div>
    );
}

export default LoginPage;