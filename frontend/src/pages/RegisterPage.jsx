// frontend/src/pages/RegisterPage.jsx
import React from 'react';
import RegisterForm from '../features/auth/RegisterForm'; // We'll create this next
import { Link } from 'react-router-dom'; // For linking to login page

function RegisterPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-gray-100 px-4 py-12">
            <div className="w-full max-w-md">
                {/* Optional: Add Logo or App Name Header */}
                <h1 className="text-3xl font-bold text-center text-white mb-8">
                    Join freq.space
                </h1>

                <RegisterForm />

                <p className="mt-8 text-center text-sm text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-white hover:text-gray-300 underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;