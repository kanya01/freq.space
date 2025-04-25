// frontend/src/features/onboarding/steps/CompletionStep.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { updateUser } from '../../auth/authSlice';

const CompletionStep = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleComplete = async () => {
        try {
            const response = await api.post('/api/v1/onboarding/complete');
            dispatch(updateUser(response.data));
            navigate('/');
        } catch (error) {
            console.error('Error completing onboarding:', error);
        }
    };

    return (
        <div className="space-y-6 text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-2xl font-bold">You're all set!</h2>
            <p className="text-gray-400">
                Your profile is ready. You can now explore freq.space and connect with other music professionals.
            </p>

            <div className="flex flex-col items-center gap-4 mt-8">
                <button
                    onClick={handleComplete}
                    className="px-8 py-3 bg-white text-black rounded-md hover:bg-gray-200 font-semibold"
                >
                    Go to Dashboard
                </button>
                <p className="text-sm text-gray-500">
                    You can always complete your profile later
                </p>
            </div>
        </div>
    );
};

export default CompletionStep;