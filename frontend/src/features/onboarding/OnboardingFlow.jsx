// frontend/src/features/onboarding/OnboardingFlow.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// import { updateProfile } from '../auth/authSlice';
import UserTypeStep from './steps/UserTypeStep';
import ExperienceStep from './steps/ExperienceStep';
import SkillsStep from './steps/SkillsStep';
import CompletionStep from './steps/CompletionStep';

const OnboardingFlow = () => {
    const user = useSelector(state => state.auth.user);
    const [currentStep, setCurrentStep] = useState(user?.profile?.onboardingStep || 0);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (user?.profile?.onboardingCompleted) {
            navigate('/');
        }
    }, [user, navigate]);

    const nextStep = () => setCurrentStep(prev => prev + 1);
    const prevStep = () => setCurrentStep(prev => prev - 1);

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return <UserTypeStep onNext={nextStep} />;
            case 1:
                return <ExperienceStep onNext={nextStep} onBack={prevStep} />;
            case 2:
                return <SkillsStep onNext={nextStep} onBack={prevStep} />;
            case 3:
                return <CompletionStep />;
            default:
                return <UserTypeStep onNext={nextStep} />;
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-3xl mx-auto px-4 py-12">
                {/* Progress bar */}
                <div className="mb-8">
                    <div className="flex justify-between mb-2">
                        {['User Type', 'Experience', 'Skills', 'Complete'].map((step, index) => (
                            <div
                                key={step}
                                className={`text-sm ${index <= currentStep ? 'text-white' : 'text-gray-600'}`}
                            >
                                {step}
                            </div>
                        ))}
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                        <div
                            className="bg-white h-2 rounded-full transition-all duration-300"
                            style={{ width: `${((currentStep + 1) / 4) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Step content */}
                {renderStep()}
            </div>
        </div>
    );
};

export default OnboardingFlow;