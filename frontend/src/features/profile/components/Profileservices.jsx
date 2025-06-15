// frontend/src/features/profile/components/ProfileServices.jsx

import React from 'react';
import {
    CurrencyDollarIcon,
    ClockIcon,
    MusicalNoteIcon,
    SparklesIcon,
    CheckIcon
} from '@heroicons/react/24/outline';

const ProfileServices = ({ user, isOwnProfile }) => {
    // Sample services - replace with actual data from user object when available
    const services = [
        {
            id: '1',
            title: 'Music Production',
            description: 'Full track production with professional quality mixing and mastering included.',
            price: '£200 - £500',
            duration: '7-14 days',
            features: ['Unlimited revisions', 'Source files included', 'Commercial license'],
            popular: true
        },
        {
            id: '2',
            title: 'Mixing & Mastering',
            description: 'Professional mixing and mastering to make your track radio-ready.',
            price: '£50 - £100',
            duration: '3-5 days',
            features: ['2 revisions', 'Multiple formats', 'Streaming optimized']
        },
        {
            id: '3',
            title: 'Beat Production',
            description: 'Custom beat creation tailored to your style and preferences.',
            price: '£100 - £300',
            duration: '5-10 days',
            features: ['Exclusive rights', 'Stem files', 'Custom BPM']
        }
    ];

    return (
        <div className="grid grid-cols-1 gap-6">
            {services.map((service) => (
                <div
                    key={service.id}
                    className="relative bg-white rounded-xl p-6 shadow-sm border border-timberwolf-200 hover:shadow-lg transition-all duration-300 hover:border-flame-300 group"
                >
                    {/* Popular badge */}
                    {service.popular && (
                        <div className="absolute -top-3 left-6">
                            <span className="inline-flex items-center px-3 py-1 bg-flame-600 text-white text-xs font-medium rounded-full">
                                <SparklesIcon className="h-3 w-3 mr-1" />
                                Most Popular
                            </span>
                        </div>
                    )}

                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-timberwolf-100 to-timberwolf-200 flex items-center justify-center group-hover:from-flame-100 group-hover:to-flame-200 transition-colors">
                                <MusicalNoteIcon className="h-6 w-6 text-black-olive-700 group-hover:text-flame-700" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-eerie-black mb-2">{service.title}</h3>
                                <p className="text-black-olive-600 leading-relaxed">{service.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                        <ul className="space-y-2">
                            {service.features.map((feature, index) => (
                                <li key={index} className="flex items-center text-sm text-black-olive-700">
                                    <CheckIcon className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Price and Duration */}
                    <div className="flex items-center justify-between pt-4 border-t border-timberwolf-200">
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center text-black-olive-700">
                                <CurrencyDollarIcon className="h-5 w-5 mr-2 text-flame-600" />
                                <span className="font-bold text-lg text-eerie-black">{service.price}</span>
                            </div>
                            <div className="flex items-center text-black-olive-600">
                                <ClockIcon className="h-5 w-5 mr-2" />
                                <span className="text-sm">{service.duration}</span>
                            </div>
                        </div>

                        <button className="px-6 py-2.5 bg-eerie-black text-floral-white rounded-xl hover:bg-black-olive transition-colors font-medium shadow-sm hover:shadow-md">
                            Request Service
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProfileServices;