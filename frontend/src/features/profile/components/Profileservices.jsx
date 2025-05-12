// frontend/src/features/profile/components/ProfileServices.jsx

import React from 'react';
import { CurrencyDollarIcon, ClockIcon, MusicalNoteIcon } from '@heroicons/react/24/outline';

const ProfileServices = ({ user, isOwnProfile }) => {
    // Sample services - replace with actual data from user object when available
    const services = [
        {
            id: '1',
            title: 'Music Production',
            description: 'Full track production with professional quality mixing and mastering included.',
            price: '£200 - £500',
            duration: '7-14 days',
            icon: 'music'
        },
        {
            id: '2',
            title: 'Mixing & Mastering',
            description: 'Professional mixing and mastering to make your track radio-ready.',
            price: '£50 - £100',
            duration: '3-5 days',
            icon: 'mixer'
        },
        {
            id: '3',
            title: 'Beat Production',
            description: 'Custom beat creation tailored to your style and preferences.',
            price: '£100 - £300',
            duration: '5-10 days',
            icon: 'beat'
        }
    ];

    return (
        <div className="space-y-6">
            {isOwnProfile && (
                <div className="flex justify-end mb-6">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
                        + Add Service
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service) => (
                    <div key={service.id} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                        <div className="flex items-center mb-4">
                            <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center mr-4">
                                <MusicalNoteIcon className="h-5 w-5 text-blue-400" />
                            </div>
                            <h3 className="text-lg font-medium">{service.title}</h3>
                        </div>

                        <p className="text-gray-400 mb-6">{service.description}</p>

                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center text-gray-300">
                                <CurrencyDollarIcon className="h-4 w-4 mr-1 text-gray-500" />
                                {service.price}
                            </div>
                            <div className="flex items-center text-gray-300">
                                <ClockIcon className="h-4 w-4 mr-1 text-gray-500" />
                                {service.duration}
                            </div>
                        </div>

                        <button className="w-full mt-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700">
                            Request Service
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProfileServices;