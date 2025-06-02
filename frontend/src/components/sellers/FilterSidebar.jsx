import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
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
        <div className="bg-gray-900 rounded-lg p-6 sticky top-8">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-white">Filters</h3>
                {hasActiveFilters && (
                    <button
                        onClick={clearAllFilters}
                        className="text-sm text-blue-400 hover:text-blue-300 underline"
                    >
                        Clear all
                    </button>
                )}
            </div>

            <div className="space-y-8">
                {/* Professional Type */}
                <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-3">Professional Type</h4>
                    <div className="space-y-2">
                        {Object.values(USER_TYPES).map((type) => (
                            <label
                                key={type}
                                className="flex items-center cursor-pointer group"
                            >
                                <input
                                    type="checkbox"
                                    checked={filters.userType === type}
                                    onChange={() => handleFilterChange('userType', type)}
                                    className="sr-only"
                                />
                                <div className={`w-4 h-4 rounded border mr-3 flex items-center justify-center transition-colors ${
                                    filters.userType === type
                                        ? 'bg-blue-600 border-blue-600'
                                        : 'border-gray-600 group-hover:border-gray-500'
                                }`}>
                                    {filters.userType === type && (
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <span className="text-gray-300 text-sm group-hover:text-white transition-colors">
                                    {type}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Experience Level */}
                <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-3">Experience Level</h4>
                    <div className="space-y-2">
                        {Object.values(EXPERIENCE_LEVELS).map((level) => (
                            <label
                                key={level}
                                className="flex items-center cursor-pointer group"
                            >
                                <input
                                    type="checkbox"
                                    checked={filters.experienceLevel === level}
                                    onChange={() => handleFilterChange('experienceLevel', level)}
                                    className="sr-only"
                                />
                                <div className={`w-4 h-4 rounded border mr-3 flex items-center justify-center transition-colors ${
                                    filters.experienceLevel === level
                                        ? 'bg-blue-600 border-blue-600'
                                        : 'border-gray-600 group-hover:border-gray-500'
                                }`}>
                                    {filters.experienceLevel === level && (
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <span className="text-gray-300 text-sm group-hover:text-white transition-colors">
                                    {level}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Active Skills Filter */}
                {filters.skills && (
                    <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-3">Active Skill Filter</h4>
                        <div className="flex items-center justify-between p-2 bg-gray-800 rounded-md">
                            <span className="text-sm text-white">{filters.skills}</span>
                            <button
                                onClick={() => handleFilterChange('skills', '')}
                                className="text-gray-400 hover:text-white ml-2"
                            >
                                <XMarkIcon className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Active Location Filter */}
                {filters.location && (
                    <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-3">Active Location Filter</h4>
                        <div className="flex items-center justify-between p-2 bg-gray-800 rounded-md">
                            <span className="text-sm text-white">{filters.location}</span>
                            <button
                                onClick={() => handleFilterChange('location', '')}
                                className="text-gray-400 hover:text-white ml-2"
                            >
                                <XMarkIcon className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FilterSidebar;