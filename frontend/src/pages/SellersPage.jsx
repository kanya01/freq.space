import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/sellers/SearchBar';
import SellerGrid from '../components/sellers/SellerGrid';
import FilterSidebar from '../components/sellers/FilterSidebar';
import Layout from '../components/layout/Layout';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

const SellersPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        pages: 1,
        total: 0,
        hasMore: false
    });
    const [showFilters, setShowFilters] = useState(false);

    // Get initial search state from URL params
    const [searchState, setSearchState] = useState({
        query: searchParams.get('q') || '',
        userType: searchParams.get('userType') || '',
        experienceLevel: searchParams.get('experienceLevel') || '',
        location: searchParams.get('location') || '',
        skills: searchParams.get('skills') || ''
    });

    // Update URL when search state changes
    useEffect(() => {
        const params = new URLSearchParams();
        Object.entries(searchState).forEach(([key, value]) => {
            if (value) params.set(key, value);
        });
        setSearchParams(params);
    }, [searchState, setSearchParams]);

    // Fetch sellers when search state changes
    useEffect(() => {
        fetchSellers(1); // Reset to page 1 on new search
    }, [searchState]);

    const fetchSellers = async (page = 1) => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '12',
                ...(searchState.query && { q: searchState.query }),
                ...(searchState.userType && { userType: searchState.userType }),
                ...(searchState.experienceLevel && { experienceLevel: searchState.experienceLevel }),
                ...(searchState.skills && { skills: searchState.skills })
            });

            // Parse location if provided
            if (searchState.location) {
                const [city, country] = searchState.location.split(',').map(s => s.trim());
                if (city) params.set('city', city);
                if (country) params.set('country', country);
            }

            const response = await fetch(`/api/v1/profile/search?${params}`);
            const data = await response.json();

            if (response.ok) {
                if (page === 1) {
                    setSellers(data.profiles);
                } else {
                    setSellers(prev => [...prev, ...data.profiles]);
                }
                setPagination({
                    page: data.page,
                    pages: data.pages,
                    total: data.total,
                    hasMore: data.hasMore
                });
            } else {
                setError(data.message || 'Failed to fetch sellers');
            }
        } catch (err) {
            setError('Network error. Please try again.');
            console.error('Fetch sellers error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (searchData) => {
        setSearchState(searchData);
    };

    const handleLoadMore = () => {
        if (pagination.hasMore && !loading) {
            fetchSellers(pagination.page + 1);
        }
    };

    return (
        <Layout>
            <div className="min-h-screen bg-black text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Find Creative Professionals
                        </h1>
                        <p className="text-gray-400">
                            Discover talented professionals for your next project
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-8">
                        <SearchBar
                            onSearch={handleSearch}
                            initialValues={searchState}
                        />
                    </div>

                    <div className="flex gap-8">
                        {/* Filters Sidebar */}
                        <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-64 flex-shrink-0`}>
                            <FilterSidebar
                                filters={searchState}
                                onFilterChange={handleSearch}
                            />
                        </div>

                        {/* Main Content */}
                        <div className="flex-1">
                            {/* Mobile filter toggle */}
                            <div className="lg:hidden mb-6">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                                >
                                    <AdjustmentsHorizontalIcon className="h-5 w-5" />
                                    <span>Filters</span>
                                </button>
                            </div>

                            {/* Results Header */}
                            <div className="mb-6">
                                <p className="text-gray-400">
                                    {loading && sellers.length === 0 ? (
                                        'Searching...'
                                    ) : (
                                        `${pagination.total} professional${pagination.total !== 1 ? 's' : ''} found`
                                    )}
                                </p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mb-6 p-4 bg-red-900/50 border border-red-800/50 rounded-lg">
                                    <p className="text-red-300">{error}</p>
                                </div>
                            )}

                            {/* Seller Grid */}
                            <SellerGrid
                                sellers={sellers}
                                loading={loading}
                                onLoadMore={handleLoadMore}
                                hasMore={pagination.hasMore}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default SellersPage;