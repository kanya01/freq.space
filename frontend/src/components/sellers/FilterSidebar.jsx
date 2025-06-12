import React from 'react';
import { XMarkIcon, AdjustmentsHorizontalIcon, UserGroupIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { USER_TYPES, EXPERIENCE_LEVELS } from '../../constants/userConstants';

const FilterSidebar = ({ filters, onFilterChange }) => {
    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters };

        // Toggle filter off if same value is selected
        if (newFilters[key] === value) {
            newFilters[key] = '';
        } else {
            newFilters[key] = value;
        }

        onFilterChange(newFilters);
    };

    const clearAllFilters = () => {
        onFilterChange({
            query: filters.query, // Keep the search query
            userType: '',
            experienceLevel: '',
            location: '',
            skills: ''
        });
    };

    const hasActiveFilters = filters.userType || filters.experienceLevel || filters.location || filters.skills;

    return (
        <div className="bg-white rounded-xl border border-timberwolf-200 shadow-lg overflow-hidden">
            {/* Compact Header */}
            <div className="bg-gradient-to-r from-eerie-black to-black-olive px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-white/10 rounded-lg">
                            <AdjustmentsHorizontalIcon className="h-4 w-4 text-white" />
                        </div>
                        <h3 className="text-base font-semibold text-white">Filters</h3>
                    </div>
                    {hasActiveFilters && (
                        <button
                            onClick={clearAllFilters}
                            className="text-xs text-white/80 hover:text-white underline transition-colors"
                        >
                            Clear all
                        </button>
                    )}
                </div>
                {hasActiveFilters && (
                    <p className="text-white/70 text-xs mt-1">
                        {Object.values(filters).filter(Boolean).length - (filters.query ? 1 : 0)} active filters
                    </p>
                )}
            </div>

            <div className="p-4 space-y-6">
                {/* Professional Type */}
                <div>
                    <div className="flex items-center space-x-2 mb-3">
                        <UserGroupIcon className="h-4 w-4 text-black-olive-600" />
                        <h4 className="font-semibold text-eerie-black text-sm">Professional Type</h4>
                    </div>
                    <div className="space-y-2">
                        {Object.values(USER_TYPES).map((type) => (
                            <label
                                key={type}
                                className="flex items-center cursor-pointer group"
                            >
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={filters.userType === type}
                                        onChange={() => handleFilterChange('userType', type)}
                                        className="sr-only"
                                    />
                                    <div className={`w-4 h-4 rounded-lg border-2 mr-2 flex items-center justify-center transition-all duration-200 ${
                                        filters.userType === type
                                            ? 'bg-flame-500 border-flame-500 shadow-md'
                                            : 'border-timberwolf-400 group-hover:border-flame-300 group-hover:bg-flame-50'
                                    }`}>
                                        {filters.userType === type && (
                                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                <span className={`text-sm transition-colors ${
                                    filters.userType === type
                                        ? 'text-eerie-black font-medium'
                                        : 'text-black-olive-700 group-hover:text-eerie-black'
                                }`}>
                                    {type}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Experience Level */}
                <div>
                    <div className="flex items-center space-x-2 mb-3">
                        <AcademicCapIcon className="h-4 w-4 text-black-olive-600" />
                        <h4 className="font-semibold text-eerie-black text-sm">Experience Level</h4>
                    </div>
                    <div className="space-y-2">
                        {Object.values(EXPERIENCE_LEVELS).map((level) => (
                            <label
                                key={level}
                                className="flex items-center cursor-pointer group"
                            >
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={filters.experienceLevel === level}
                                        onChange={() => handleFilterChange('experienceLevel', level)}
                                        className="sr-only"
                                    />
                                    <div className={`w-4 h-4 rounded-lg border-2 mr-2 flex items-center justify-center transition-all duration-200 ${
                                        filters.experienceLevel === level
                                            ? 'bg-flame-500 border-flame-500 shadow-md'
                                            : 'border-timberwolf-400 group-hover:border-flame-300 group-hover:bg-flame-50'
                                    }`}>
                                        {filters.experienceLevel === level && (
                                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                <span className={`text-sm transition-colors ${
                                    filters.experienceLevel === level
                                        ? 'text-eerie-black font-medium'
                                        : 'text-black-olive-700 group-hover:text-eerie-black'
                                }`}>
                                    {level}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Active Filters */}
                {(filters.skills || filters.location) && (
                    <div>
                        <h4 className="font-semibold text-eerie-black mb-3 text-sm">Active Filters</h4>
                        <div className="space-y-2">
                            {/* Skills Filter */}
                            {filters.skills && (
                                <div className="flex items-center justify-between p-2 bg-flame-50 border border-flame-200 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-base">🎵</span>
                                        <div>
                                            <p className="text-xs font-medium text-eerie-black">Skill</p>
                                            <p className="text-xs text-black-olive-600">{filters.skills}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleFilterChange('skills', '')}
                                        className="p-1 text-flame-600 hover:text-flame-700 hover:bg-flame-100 rounded-full transition-colors"
                                    >
                                        <XMarkIcon className="h-3 w-3" />
                                    </button>
                                </div>
                            )}

                            {/* Location Filter */}
                            {filters.location && (
                                <div className="flex items-center justify-between p-2 bg-flame-50 border border-flame-200 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-base">📍</span>
                                        <div>
                                            <p className="text-xs font-medium text-eerie-black">Location</p>
                                            <p className="text-xs text-black-olive-600">{filters.location}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleFilterChange('location', '')}
                                        className="p-1 text-flame-600 hover:text-flame-700 hover:bg-flame-100 rounded-full transition-colors"
                                    >
                                        <XMarkIcon className="h-3 w-3" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Quick Stats */}
                <div className="pt-4 border-t border-timberwolf-200">
                    <div className="text-xs text-black-olive-600 space-y-1">
                        <div className="flex justify-between">
                            <span>Artists:</span>
                            <span className="font-medium">1,247</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Producers:</span>
                            <span className="font-medium">892</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Engineers:</span>
                            <span className="font-medium">456</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;