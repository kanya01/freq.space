// frontend/src/pages/ProfilePage.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'; // For Edit Profile link
import { selectUser } from '../features/auth/authSlice'; // Import user selector

function ProfilePage() {
    const user = useSelector(selectUser);

    // Optional: Show loading state if user data isn't available yet
    // Note: ProtectedRoute should handle the main loading/redirect,
    // but a check here can prevent errors if accessed momentarily before user is set.
    if (!user) {
        // You could return a loading spinner, but ProtectedRoute often makes this unnecessary
        return (
            <div className="flex justify-center items-center h-screen bg-black">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    // Helper to display profile fields safely
    const getProfileValue = (field) => user.profile?.[field] || 'Not set';
    const getLocation = () => {
        const city = user.profile?.location?.city;
        const country = user.profile?.location?.country;
        if (city && country) return `${city}, ${country}`;
        if (city) return city;
        if (country) return country;
        return 'Not set';
    }
    const getSocialLink = (platform) => user.profile?.socialLinks?.get(platform);

    return (
        <div className="min-h-screen bg-black text-gray-100 p-8">
            <div className="max-w-4xl mx-auto bg-gray-900 rounded-lg shadow-lg overflow-hidden">
                {/* Profile Header (Placeholder for cover image later) */}
                <div className="bg-gray-800 p-6 border-b border-gray-700">
                    {/* Avatar Placeholder */}
                    <div className="flex items-center space-x-4">
                        <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center text-gray-400">
                            {/* Placeholder for Avatar Image */}
                            <span className="text-3xl font-bold">{user.username?.charAt(0).toUpperCase()}</span>
                            {/* <img src={user.profile?.avatarUrl || defaultAvatar} alt="Avatar" className="w-full h-full rounded-full object-cover" /> */}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">{user.username}</h1>
                            <p className="text-sm text-gray-400">{user.email}</p>
                            <p className="text-sm text-gray-400">Experience: {getProfileValue('experienceLevel')}</p>
                        </div>
                    </div>
                    {/* Edit Profile Button */}
                    <div className="mt-4 text-right">
                        <Link
                            to="/profile/edit" // Route for editing profile (to be created)
                            className="inline-block px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700"
                        >
                            Edit Profile
                        </Link>
                    </div>
                </div>

                {/* Profile Details */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Column 1 */}
                    <div>
                        <h2 className="text-lg font-semibold text-white mb-3 border-b border-gray-700 pb-1">Details</h2>
                        <dl className="space-y-2 text-sm">
                            <div className="flex">
                                <dt className="w-1/3 text-gray-400 font-medium">Full Name:</dt>
                                <dd className="w-2/3 text-gray-200">{`${getProfileValue('firstName')} ${getProfileValue('lastName')}`.trim() || 'Not set'}</dd>
                            </div>
                            <div className="flex">
                                <dt className="w-1/3 text-gray-400 font-medium">Location:</dt>
                                <dd className="w-2/3 text-gray-200">{getLocation()}</dd>
                            </div>
                            <div className="flex">
                                <dt className="w-1/3 text-gray-400 font-medium">Bio:</dt>
                                <dd className="w-2/3 text-gray-200 whitespace-pre-wrap">{getProfileValue('bio') || 'No bio yet.'}</dd>
                            </div>
                        </dl>
                    </div>

                    {/* Column 2 */}
                    <div>
                        <h2 className="text-lg font-semibold text-white mb-3 border-b border-gray-700 pb-1">Skills</h2>
                        {user.profile?.skills?.length > 0 ? (
                            <ul className="flex flex-wrap gap-2">
                                {user.profile.skills.map((skill, index) => (
                                    <li key={index} className="px-3 py-1 bg-gray-700 text-gray-200 rounded-full text-xs font-medium">
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-400">No skills listed.</p>
                        )}

                        <h2 className="text-lg font-semibold text-white mt-6 mb-3 border-b border-gray-700 pb-1">Links</h2>
                        {user.profile?.socialLinks && user.profile.socialLinks.size > 0 ? (
                            <dl className="space-y-2 text-sm">
                                {/* Example: Iterate through Map entries */}
                                {Array.from(user.profile.socialLinks.entries()).map(([key, value]) => (
                                    value && <div key={key} className="flex">
                                        <dt className="w-1/3 text-gray-400 font-medium capitalize">{key}:</dt>
                                        {/* Make links clickable */}
                                        <dd className="w-2/3 text-blue-400 hover:text-blue-300 overflow-hidden overflow-ellipsis">
                                            <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noopener noreferrer">{value}</a>
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        ) : (
                            <p className="text-sm text-gray-400">No links provided.</p>
                        )}
                    </div>
                </div>

                {/* Placeholder for Portfolio/Uploads Section */}
                <div className="p-6 border-t border-gray-700">
                    <h2 className="text-lg font-semibold text-white mb-3">Portfolio</h2>
                    <p className="text-sm text-gray-400">Your uploaded tracks and videos will appear here...</p>
                </div>

            </div>
        </div>
    );
}

export default ProfilePage;