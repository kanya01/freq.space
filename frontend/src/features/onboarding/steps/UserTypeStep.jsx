// frontend/src/features/onboarding/steps/UserTypeStep.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import api from '../../../services/api';
import { updateUser} from "../../auth/authSlice.js";

const UserTypeStep = ({ onNext }) => {
    const dispatch = useDispatch();

    const userTypes = [
        { id: 'Artist', title: 'Artist', description: 'Musician, band, or performer', icon: '🎸' },
        { id: 'Producer', title: 'Producer', description: 'Music producer or beat maker', icon: '🎛️' },
        { id: 'Engineer', title: 'Engineer', description: 'Recording, mixing, or mastering engineer', icon: '🎚️' },
        { id: 'Songwriter', title: 'Songwriter', description: 'Lyricist or composer', icon: '✍️' },
        { id: 'Vocalist', title: 'Vocalist', description: 'Singer or voice artist', icon: '🎤' },
        { id: 'Session Musician', title: 'Session Musician', description: 'Studio or live musician', icon: '🎻' },
        { id: 'Video Producer', title: 'Video Producer', description: 'Music video creator', icon: '🎥' }
    ];

    const handleSelect = async (userType) => {
        try {
            const response = await api.post('/api/v1/onboarding/user-type', { userType });
            // Update user in Redux store
            dispatch(updateUser(response.data));
            onNext();
        } catch (error) {
            console.error('Error updating user type:', error);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">What best describes you?</h2>
            <p className="text-gray-400 text-center">Select your primary role in the music industry</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userTypes.map((type) => (
                    <button
                        key={type.id}
                        onClick={() => handleSelect(type.id)}
                        className="p-6 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors text-left"
                    >
                        <div className="flex items-center space-x-4">
                            <span className="text-3xl">{type.icon}</span>
                            <div>
                                <h3 className="text-lg font-semibold">{type.title}</h3>
                                <p className="text-gray-400 text-sm">{type.description}</p>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default UserTypeStep;