import React, { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';

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

    const getSuggestionTypeLabel = (type) => {
        switch (type) {
            case 'skill':
                return 'Skill';
            case 'userType':
                return 'Professional Type';
            case 'location':
                return 'Location';
            default:
                return 'Search';
        }
    };

    return (
        <div className="relative" ref={suggestionsRef}>
            <form onSubmit={handleSubmit}>
                <div className="relative group">
                    {/* Main search input */}
                    <div className="relative bg-white rounded-2xl shadow-lg border border-timberwolf-300 group-focus-within:border-flame-400 group-focus-within:shadow-xl transition-all duration-300">
                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-6 w-6 text-black-olive-600 group-focus-within:text-flame-600 transition-colors" />
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
                            className="block w-full pl-16 pr-16 py-5 bg-transparent text-lg text-eerie-black placeholder-black-olive-500 focus:outline-none rounded-2xl"
                        />

                        {query && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="absolute inset-y-0 right-0 pr-6 flex items-center group/clear"
                            >
                                <XMarkIcon className="h-5 w-5 text-black-olive-500 group-hover/clear:text-eerie-black transition-colors" />
                            </button>
                        )}

                        {/* Loading indicator */}
                        {loading && (
                            <div className="absolute inset-y-0 right-0 pr-16 flex items-center">
                                <SparklesIcon className="h-5 w-5 text-flame-500 animate-pulse" />
                            </div>
                        )}
                    </div>

                    {/* Search hint */}
                    <p className="mt-3 text-center text-sm text-black-olive-500">
                        Try searching for "music producer", "Los Angeles", or "mixing"
                    </p>
                </div>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && (suggestions.length > 0 || loading) && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-timberwolf-200 rounded-xl shadow-2xl max-h-80 overflow-y-auto">
                    {loading && suggestions.length === 0 && (
                        <div className="px-6 py-4 text-black-olive-500 text-sm flex items-center">
                            <SparklesIcon className="h-4 w-4 mr-2 animate-pulse" />
                            Finding perfect matches...
                        </div>
                    )}

                    {suggestions.length > 0 && (
                        <div className="py-2">
                            <div className="px-4 py-2 text-xs font-medium text-black-olive-600 uppercase tracking-wide">
                                Suggestions
                            </div>
                            {suggestions.map((suggestion, index) => (
                                <button
                                    key={`${suggestion.type}-${suggestion.value}`}
                                    type="button"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className={`w-full px-6 py-4 text-left hover:bg-timberwolf-100 focus:bg-timberwolf-100 focus:outline-none transition-colors border-l-4 border-transparent hover:border-flame-400 ${
                                        index === selectedSuggestionIndex ? 'bg-timberwolf-100 border-flame-400' : ''
                                    }`}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0 w-10 h-10 bg-timberwolf-200 rounded-full flex items-center justify-center">
                                            <span className="text-lg">{getSuggestionIcon(suggestion.type)}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-eerie-black font-medium truncate">
                                                {suggestion.label}
                                            </p>
                                            <div className="flex items-center space-x-3 mt-1">
                                                <span className="text-black-olive-600 text-sm">
                                                    {getSuggestionTypeLabel(suggestion.type)}
                                                </span>
                                                {suggestion.count && (
                                                    <>
                                                        <span className="text-black-olive-400">•</span>
                                                        <span className="text-flame-600 text-sm font-medium">
                                                            {suggestion.count} professionals
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;