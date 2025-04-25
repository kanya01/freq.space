// frontend/src/pages/HomePage.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice'; // Import user selector

function HomePage() {
    // Get user data from Redux state
    const user = useSelector(selectUser);

    return (
        <div className="min-h-screen bg-black text-gray-100 p-8">
            <h1 className="text-3xl font-bold text-white mb-6">
                Welcome to freq.space{user ? `, ${user.username}` : ''}!
            </h1>
            <p className="text-gray-300 mb-4">
                This is your main dashboard area. More features coming soon!
            </p>

            {/* Placeholder for future feed or content */}
            <div className="mt-10 p-6 bg-gray-900 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-white mb-4">Activity Feed</h2>
                <p className="text-gray-400">Your feed will appear here...</p>
                {/* Add Post creation form or feed display later */}
            </div>

            {/* You can add links or quick actions here */}
            {/* e.g., Link to Profile, Create Post button */}
        </div>
    );
}

export default HomePage;