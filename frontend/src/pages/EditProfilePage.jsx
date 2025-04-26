import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUser, updateUser } from '../features/auth/authSlice';
import profileService from '../services/profileService';
import PortfolioManager from '../features/profile/components/PortfolioManager';

const EditProfilePage = () => {
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        bio: '',
        location: {
            city: '',
            country: ''
        },
        skills: [],
        socialLinks: {
            website: '',
            twitter: '',
            instagram: '',
            youtube: '',
            soundcloud: '',
            spotify: ''
        }
    });

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.profile.firstName || '',
                lastName: user.profile.lastName || '',
                bio: user.profile.bio || '',
                location: {
                    city: user.profile.location?.city || '',
                    country: user.profile.location?.country || '',
                },
                skills: user.profile.skills || [],
                socialLinks: {
                    website: user.profile.socialLinks?.website || '',
                    twitter: user.profile.socialLinks?.twitter || '',
                    instagram: user.profile.socialLinks?.instagram || '',
                    youtube: user.profile.socialLinks?.youtube || '',
                    soundcloud: user.profile.socialLinks?.soundcloud || '',
                    spotify: user.profile.socialLinks?.spotify || '',
                }
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const formDataToSend = new FormData();

            // Add text fields
            formDataToSend.append('firstName', formData.firstName);
            formDataToSend.append('lastName', formData.lastName);
            formDataToSend.append('bio', formData.bio);
            formDataToSend.append('location', JSON.stringify(formData.location));
            formDataToSend.append('skills', JSON.stringify(formData.skills));
            formDataToSend.append('socialLinks', JSON.stringify(formData.socialLinks));

            // Add file if selected
            const avatarInput = document.getElementById('avatar');
            if (avatarInput.files[0]) {
                formDataToSend.append('avatar', avatarInput.files[0]);
            }

            const coverImageInput = document.getElementById('coverImage');
            if (coverImageInput.files[0]) {
                formDataToSend.append('coverImage', coverImageInput.files[0]);
            }

            const updatedUser = await profileService.updateProfile(formDataToSend);
            dispatch(updateUser(updatedUser));
            navigate('/profile');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-gray-100 p-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold text-white mb-8">Edit Profile</h1>

                {error && (
                    <div className="bg-red-900 text-red-100 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Avatar */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Avatar
                        </label>
                        <input
                            type="file"
                            id="avatar"
                            accept="image/*"
                            className="block w-full text-sm text-gray-400
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-semibold
                                file:bg-gray-800 file:text-white
                                hover:file:bg-gray-700"
                        />
                    </div>

                    {/* Cover Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Cover Image
                        </label>
                        <input
                            type="file"
                            id="coverImage"
                            accept="image/*"
                            className="block w-full text-sm text-gray-400
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-semibold
                                file:bg-gray-800 file:text-white
                                hover:file:bg-gray-700"
                        />
                    </div>

                    {/* Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                First Name
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                            />
                        </div>
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Bio
                        </label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                        />
                    </div>

                    {/* Location */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                City
                            </label>
                            <input
                                type="text"
                                name="location.city"
                                value={formData.location.city}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Country
                            </label>
                            <input
                                type="text"
                                name="location.country"
                                value={formData.location.country}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                            />
                        </div>
                    </div>

                    {/* Social Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Social Links</h3>
                        <div className="space-y-4">
                            {Object.keys(formData.socialLinks).map((platform) => (
                                <div key={platform}>
                                    <label className="block text-sm font-medium text-gray-300 mb-2 capitalize">
                                        {platform}
                                    </label>
                                    <input
                                        type="url"
                                        name={`socialLinks.${platform}`}
                                        value={formData.socialLinks[platform]}
                                        onChange={handleChange}
                                        placeholder={`https://${platform}.com/username`}
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/profile')}
                            className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>

                {/* Portfolio Manager */}
                <div className="mt-12">
                    <PortfolioManager />
                </div>
            </div>
        </div>
    );
};

export default EditProfilePage;