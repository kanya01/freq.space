// frontend/src/features/onboarding/steps/SkillsStep.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import api from '../../../services/api';
import { updateUser } from "../../auth/authSlice.js";

const SkillsStep = ({ onNext, onBack }) => {
    const dispatch = useDispatch();
    const [selectedSkills, setSelectedSkills] = useState([]);

    const skillOptions = [
        'Vocals', 'Guitar', 'Bass', 'Drums', 'Piano/Keyboard', 'Synthesizer',
        'Music Production', 'Mixing', 'Mastering', 'Sound Design', 'Composition',
        'Arrangement', 'Songwriting', 'Lyrics', 'Music Theory', 'Recording',
        'Live Performance', 'DJing', 'Video Production', 'Music Direction'
    ];

    const toggleSkill = (skill) => {
        setSelectedSkills(prev =>
            prev.includes(skill)
                ? prev.filter(s => s !== skill)
                : [...prev, skill]
        );
    };

    const handleSubmit = async () => {
        try {
            const response = await api.post('/api/v1/onboarding/skills', { skills: selectedSkills });
            dispatch(updateUser(response.data));
            onNext();
        } catch (error) {
            console.error('Error updating skills:', error);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">What are your skills?</h2>
            <p className="text-gray-400 text-center">Select all that apply</p>

            <div className="flex flex-wrap gap-2 justify-center">
                {skillOptions.map((skill) => (
                    <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`px-4 py-2 rounded-full text-sm transition-colors ${
                            selectedSkills.includes(skill)
                                ? 'bg-white text-black'
                                : 'bg-gray-800 text-white hover:bg-gray-700'
                        }`}
                    >
                        {skill}
                    </button>
                ))}
            </div>

            <div className="flex justify-between mt-8">
                <button
                    onClick={onBack}
                    className="text-gray-400 hover:text-white"
                >
                    ← Back
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={selectedSkills.length === 0}
                    className="px-6 py-2 bg-white text-black rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default SkillsStep;