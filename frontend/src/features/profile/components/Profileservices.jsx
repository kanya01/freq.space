import React from 'react';
import { CurrencyDollarIcon, ClockIcon } from '@heroicons/react/24/outline';

const ProfileServices = ({ user }) => {
    // Placeholder until services are implemented
    const services = [];

    if (!services?.length) {
        return (
            <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Services</h2>
                <p className="text-gray-400">No services listed yet.</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                    <div key={service._id} className="bg-gray-800 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-white mb-2">{service.title}</h3>
                        <p className="text-gray-400 text-sm mb-4">{service.description}</p>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center text-green-400">
                                <CurrencyDollarIcon className="h-5 w-5 mr-1" />
                                <span>{service.price}</span>
                            </div>
                            <div className="flex items-center text-gray-400">
                                <ClockIcon className="h-5 w-5 mr-1" />
                                <span>{service.deliveryTime} days</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProfileServices;