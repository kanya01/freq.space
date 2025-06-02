import React, { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

const SearchBar = ({ onSearch, initialValues = {} }) => {
    const [query, setQuery] = useState(initialValues.query || '');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

    const inputRef = useRef(null);
    const suggestionsRef = useRef(null);
    const debounceRef = useRef(null);

    // Fetch suggestions with debouncing
    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (query.length >= 2) {
            debounceRef.current = setTimeout(async () => {
                setLoading(true);
                try {
                    const response = await fetch(`/api/v1/profile/suggestions?q=${encodeURIComponent(query)}`);
                    const data = await response.json();

                    if (response.ok) {
                        setSuggestions(data.suggestions || []);
                        setShowSuggestions(true);
                    }
                } catch (err) {
                    console.error('Error fetching suggestions:', err);
                } finally {
                    setLoading(false);
                }
            }, 300);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [query]);

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        if (!showSuggestions || suggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedSuggestionIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedSuggestionIndex >= 0) {
                    handleSuggestionClick(suggestions[selectedSuggestionIndex]);
                } else {
                    handleSubmit(e);
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                setSelectedSuggestionIndex(-1);
                break;
        }
    };

    // Handle suggestion selection
    const handleSuggestionClick = (suggestion) => {
        const searchData = { ...initialValues };

        // Clear previous values to start fresh
        Object.keys(searchData).forEach(key => {
            if (key !== 'query') searchData[key] = '';
        });

        switch (suggestion.type) {
            case 'skill':
                searchData.skills = suggestion.value;
                setQuery(suggestion.value);
                break;
            case 'userType':
                searchData.userType = suggestion.value;
                setQuery(suggestion.value);
                break;
            case 'location':
                searchData.location = suggestion.value;
                setQuery(suggestion.value);
                break;
            default:
                searchData.query = suggestion.value;
                setQuery(suggestion.value);
        }

        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        onSearch(searchData);
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const searchData = { ...initialValues, query: query.trim() };
        onSearch(searchData);
        setShowSuggestions(false);
    };

    // Handle input change
    const handleInputChange = (e) => {
        setQuery(e.target.value);
        setSelectedSuggestionIndex(-1);
    };

    // Clear search
    const handleClear = () => {
        setQuery('');
        const searchData = { ...initialValues, query: '' };
        onSearch(searchData);
        setSuggestions([]);
        setShowSuggestions(false);
        inputRef.current?.focus();
    };

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
                setShowSuggestions(false);
                setSelectedSuggestionIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Get suggestion icon based on type
    const getSuggestionIcon = (type) => {
        switch (type) {
            case 'skill':
                return '🎵';
            case 'userType':
                return '👤';
            case 'location':
                return '📍';
            default:
                return '🔍';
        }
    };

    return (
        <div className="relative" ref={suggestionsRef}>
            <form onSubmit={handleSubmit}>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>

                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => {
                            if (suggestions.length > 0) setShowSuggestions(true);
                        }}
                        placeholder="Search for skills, professionals, or locations..."
                        className="block w-full pl-10 pr-12 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />

                    {query && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                            <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-white" />
                        </button>
                    )}
                </div>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && (suggestions.length > 0 || loading) && (
                <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    {loading && (
                        <div className="px-4 py-3 text-gray-400 text-sm">
                            Searching...
                        </div>
                    )}

                    {suggestions.map((suggestion, index) => (
                        <button
                            key={`${suggestion.type}-${suggestion.value}`}
                            type="button"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className={`w-full px-4 py-3 text-left hover:bg-gray-700 focus:bg-gray-700 focus:outline-none transition-colors ${
                                index === selectedSuggestionIndex ? 'bg-gray-700' : ''
                            }`}
                        >
                            <div className="flex items-center space-x-3">
                                <span className="text-lg">{getSuggestionIcon(suggestion.type)}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-medium truncate">
                                        {suggestion.label}
                                    </p>
                                    <p className="text-gray-400 text-xs capitalize">
                                        {suggestion.type}
                                        {suggestion.count && ` • ${suggestion.count} professionals`}
                                    </p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;