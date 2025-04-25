// frontend/src/features/onboarding/steps/ExperienceStep.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import api from '../../../services/api';
import { updateUser } from '../../auth/authSlice';

const ExperienceStep = ({ onNext, onBack }) => {
    const dispatch = useDispatch();

    const experienceLevels = [
        { id: 'Hobbyist', title: 'Hobbyist', description: 'Making music for fun', icon: '🎵' },
        { id: 'Part-time', title: 'Part-time', description: 'Side hustle or semi-professional', icon: '⚡' },
        { id: 'Pro', title: 'Professional', description: 'Full-time music professional', icon: '🎯' },
        { id: 'Maestro', title: 'Maestro', description: 'Industry veteran with extensive experience', icon: '👑' }
    ];

    const handleSelect = async (experienceLevel) => {
        try {
            const response = await api.post('/api/v1/onboarding/experience', { experienceLevel });
            dispatch(updateUser(response.data));
            onNext();
        } catch (error) {
            console.error('Error updating experience level:', error);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">What's your experience level?</h2>
            <p className="text-gray-400 text-center">This helps us personalize your experience</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {experienceLevels.map((level) => (
                    <button
                        key={level.id}
                        onClick={() => handleSelect(level.id)}
                        className="p-6 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors text-left"
                    >
                        <div className="flex items-center space-x-4">
                            <span className="text-3xl">{level.icon}</span>
                            <div>
                                <h3 className="text-lg font-semibold">{level.title}</h3>
                                <p className="text-gray-400 text-sm">{level.description}</p>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            <button
                onClick={onBack}
                className="mt-8 text-gray-400 hover:text-white"
            >
                ← Back
            </button>
        </div>
    );
};

export default ExperienceStep;