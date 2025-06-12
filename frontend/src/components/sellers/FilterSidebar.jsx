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
        <div className="bg-white rounded-2xl border border-timberwolf-200 shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-eerie-black to-black-olive px-6 py-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <AdjustmentsHorizontalIcon className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Filters</h3>
                    </div>
                    {hasActiveFilters && (
                        <button
                            onClick={clearAllFilters}
                            className="text-sm text-white/80 hover:text-white underline transition-colors"
                        >
                            Clear all
                        </button>
                    )}
                </div>
                {hasActiveFilters && (
                    <p className="text-white/70 text-sm mt-2">
                        {Object.values(filters).filter(Boolean).length - (filters.query ? 1 : 0)} active filters
                    </p>
                )}
            </div>

            <div className="p-6 space-y-8">
                {/* Professional Type */}
                <div>
                    <div className="flex items-center space-x-2 mb-4">
                        <UserGroupIcon className="h-5 w-5 text-black-olive-600" />
                        <h4 className="font-semibold text-eerie-black">Professional Type</h4>
                    </div>
                    <div className="space-y-3">
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
                                    <div className={`w-5 h-5 rounded-lg border-2 mr-3 flex items-center justify-center transition-all duration-200 ${
                                        filters.userType === type
                                            ? 'bg-flame-500 border-flame-500 shadow-md'
                                            : 'border-timberwolf-400 group-hover:border-flame-300 group-hover:bg-flame-50'
                                    }`}>
                                        {filters.userType === type && (
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
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
                    <div className="flex items-center space-x-2 mb-4">
                        <AcademicCapIcon className="h-5 w-5 text-black-olive-600" />
                        <h4 className="font-semibold text-eerie-black">Experience Level</h4>
                    </div>
                    <div className="space-y-3">
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
                                    <div className={`w-5 h-5 rounded-lg border-2 mr-3 flex items-center justify-center transition-all duration-200 ${
                                        filters.experienceLevel === level
                                            ? 'bg-flame-500 border-flame-500 shadow-md'
                                            : 'border-timberwolf-400 group-hover:border-flame-300 group-hover:bg-flame-50'
                                    }`}>
                                        {filters.experienceLevel === level && (
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
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
                        <h4 className="font-semibold text-eerie-black mb-4">Active Filters</h4>
                        <div className="space-y-3">
                            {/* Skills Filter */}
                            {filters.skills && (
                                <div className="flex items-center justify-between p-3 bg-flame-50 border border-flame-200 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-lg">🎵</span>
                                        <div>
                                            <p className="text-sm font-medium text-eerie-black">Skill</p>
                                            <p className="text-sm text-black-olive-600">{filters.skills}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleFilterChange('skills', '')}
                                        className="p-1 text-flame-600 hover:text-flame-700 hover:bg-flame-100 rounded-full transition-colors"
                                    >
                                        <XMarkIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            )}

                            {/* Location Filter */}
                            {filters.location && (
                                <div className="flex items-center justify-between p-3 bg-flame-50 border border-flame-200 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-lg">📍</span>
                                        <div>
                                            <p className="text-sm font-medium text-eerie-black">Location</p>
                                            <p className="text-sm text-black-olive-600">{filters.location}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleFilterChange('location', '')}
                                        className="p-1 text-flame-600 hover:text-flame-700 hover:bg-flame-100 rounded-full transition-colors"
                                    >
                                        <XMarkIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FilterSidebar;