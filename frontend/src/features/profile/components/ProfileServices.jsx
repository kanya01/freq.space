// frontend/src/features/profile/components/ProfileServices.jsx

import React from 'react';
import {
    WrenchScrewdriverIcon,
    SparklesIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

const ProfileServices = ({ user, isOwnProfile }) => {
    // For MVP launch - show coming soon state instead of hardcoded services
    return (
        <div className="text-center py-16 px-8 bg-white rounded-xl border-2 border-dashed border-timberwolf-300 shadow-sm">
            <div className="max-w-sm mx-auto">
                {/* Icon */}
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-flame-100 to-flame-200 rounded-full flex items-center justify-center">
                    <WrenchScrewdriverIcon className="h-10 w-10 text-flame-600" />
                </div>

                {/* Main message */}
                <h3 className="text-xl font-bold text-eerie-black mb-3">
                    Services Coming Soon!
                </h3>

                <p className="text-black-olive-600 mb-6 leading-relaxed">
                    We're working hard to bring you professional services.
                    {isOwnProfile
                        ? " You'll be able to offer your services to clients soon."
                        : " This professional will be able to offer services soon."
                    }
                </p>

                {/* Progress indicator */}
                <div className="flex items-center justify-center space-x-2 mb-6">
                    <SparklesIcon className="h-5 w-5 text-flame-600" />
                    <span className="text-sm font-medium text-flame-700">In Active Development</span>
                    <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-flame-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-flame-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-flame-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                </div>

                {/* Call-to-action for professionals */}
                {isOwnProfile && (
                    <div className="space-y-3">
                        <button className="inline-flex items-center px-6 py-3 bg-eerie-black text-floral-white rounded-xl hover:bg-black-olive transition-colors font-medium shadow-sm hover:shadow-md">
                            <ClockIcon className="h-5 w-5 mr-2" />
                            Get Notified When Ready
                        </button>
                        <p className="text-xs text-black-olive-500">
                            We'll email you when services go live
                        </p>
                    </div>
                )}

                {/* For visitors viewing profiles */}
                {!isOwnProfile && (
                    <div className="bg-timberwolf-50 rounded-lg p-4 border border-timberwolf-200">
                        <p className="text-sm text-black-olive-700">
                            <strong>Coming features:</strong> Service listings, pricing, booking, and more!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileServices;