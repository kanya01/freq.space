// frontend/src/features/profile/components/ProfileAbout.jsx

import React from 'react';
import {
    MapPinIcon,
    StarIcon,
    MusicalNoteIcon,
    CalendarIcon,
    LanguageIcon,
    AcademicCapIcon
} from '@heroicons/react/24/outline';

const ProfileAbout = ({ user }) => {
    return (
        <div className="space-y-6">
            {/* About Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-timberwolf-200">
                <h3 className="text-lg font-bold text-eerie-black mb-4">About</h3>

                {/* Quick Stats */}
                <div className="space-y-4">
                    <div className="flex items-center text-black-olive-700">
                        <MapPinIcon className="h-5 w-5 mr-3 text-black-olive-500" />
                        <div>
                            <p className="text-sm text-black-olive-600">Location</p>
                            <p className="font-medium">
                                {user.profile.location?.city || 'London'}, {user.profile.location?.country || 'United Kingdom'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center text-black-olive-700">
                        <AcademicCapIcon className="h-5 w-5 mr-3 text-black-olive-500" />
                        <div>
                            <p className="text-sm text-black-olive-600">Experience</p>
                            <p className="font-medium">{user.profile.experienceLevel || 'Maestro'}</p>
                        </div>
                    </div>

                    <div className="flex items-center text-black-olive-700">
                        <MusicalNoteIcon className="h-5 w-5 mr-3 text-black-olive-500" />
                        <div>
                            <p className="text-sm text-black-olive-600">Profession</p>
                            <p className="font-medium">{user.profile.userType || 'Producer'}</p>
                        </div>
                    </div>

                    <div className="flex items-center text-black-olive-700">
                        <CalendarIcon className="h-5 w-5 mr-3 text-black-olive-500" />
                        <div>
                            <p className="text-sm text-black-olive-600">Member since</p>
                            <p className="font-medium">
                                {new Date(user.createdAt).toLocaleDateString('en-US', {
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center text-black-olive-700">
                        <LanguageIcon className="h-5 w-5 mr-3 text-black-olive-500" />
                        <div>
                            <p className="text-sm text-black-olive-600">Languages</p>
                            <p className="font-medium">English, Spanish</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Skills Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-timberwolf-200">
                <h3 className="text-lg font-bold text-eerie-black mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                    {user.profile.skills && user.profile.skills.length > 0 ? (
                        user.profile.skills.map((skill, index) => (
                            <span
                                key={index}
                                className="px-3 py-1.5 bg-timberwolf-100 text-black-olive-700 rounded-full text-sm font-medium border border-timberwolf-300 hover:bg-timberwolf-200 transition-colors cursor-default"
                            >
                                {skill}
                            </span>
                        ))
                    ) : (
                        <>
                            <span className="px-3 py-1.5 bg-timberwolf-100 text-black-olive-700 rounded-full text-sm font-medium border border-timberwolf-300">
                                Music Production
                            </span>
                            <span className="px-3 py-1.5 bg-timberwolf-100 text-black-olive-700 rounded-full text-sm font-medium border border-timberwolf-300">
                                Mixing
                            </span>
                            <span className="px-3 py-1.5 bg-timberwolf-100 text-black-olive-700 rounded-full text-sm font-medium border border-timberwolf-300">
                                Mastering
                            </span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileAbout;