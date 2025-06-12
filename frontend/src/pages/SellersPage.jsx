import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/sellers/SearchBar';
import SellerGrid from '../components/sellers/SellerGrid';
import FilterSidebar from '../components/sellers/FilterSidebar';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { AdjustmentsHorizontalIcon, UsersIcon, ViewColumnsIcon, Squares2X2Icon } from '@heroicons/react/24/outline';

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
    const [viewDensity, setViewDensity] = useState('comfortable'); // 'compact' or 'comfortable'

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
                limit: '16', // Increased from 12 to show more cards
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
        <div className="min-h-screen bg-floral-white">
            <Header />

            {/* Reduced Hero Section */}
            <section className="bg-floral-white relative z-30">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-flame-900 rounded-full filter blur-3xl opacity-5 translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-timberwolf-300 rounded-full filter blur-3xl opacity-10 -translate-x-1/2 translate-y-1/2"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-eerie-black rounded-full mb-4">
                            <UsersIcon className="w-8 h-8 text-floral-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-eerie-black mb-4 tracking-tight">
                            Find Your Perfect
                            <span className="block text-black-olive">Creative Partner</span>
                        </h1>
                        <p className="text-xl text-black-olive-600 mb-6 max-w-3xl mx-auto leading-relaxed">
                            Connect with talented professionals who bring your creative vision to life
                        </p>
                    </div>

                    {/* Search Section */}
                    <div className="max-w-4xl mx-auto">
                        <SearchBar
                            onSearch={handleSearch}
                            initialValues={searchState}
                        />
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="bg-timberwolf-100 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-6">
                        {/* Desktop Filters Sidebar - Reduced width */}
                        <div className="hidden lg:block w-64 flex-shrink-0">
                            <FilterSidebar
                                filters={searchState}
                                onFilterChange={handleSearch}
                            />
                        </div>

                        {/* Main Content */}
                        <div className="flex-1">
                            {/* Enhanced Results Header with View Toggle */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                                <div>
                                    <h2 className="text-xl font-bold text-eerie-black mb-2">
                                        Creative Professionals
                                    </h2>
                                    <p className="text-black-olive-600 text-sm">
                                        {loading && sellers.length === 0 ? (
                                            'Searching professionals...'
                                        ) : (
                                            `${pagination.total.toLocaleString()} professional${pagination.total !== 1 ? 's' : ''} available`
                                        )}
                                    </p>
                                </div>

                                <div className="flex items-center space-x-4">
                                    {/* View density toggle - Desktop only */}
                                    {/*<div className="hidden md:flex items-center space-x-2 bg-white rounded-lg p-1 border border-timberwolf-300">*/}
                                    {/*    <button*/}
                                    {/*        onClick={() => setViewDensity('comfortable')}*/}
                                    {/*        className={`flex items-center px-3 py-1.5 rounded text-sm transition-colors ${*/}
                                    {/*            viewDensity === 'comfortable'*/}
                                    {/*                ? 'bg-eerie-black text-white'*/}
                                    {/*                : 'text-black-olive-600 hover:text-eerie-black'*/}
                                    {/*        }`}*/}
                                    {/*    >*/}
                                    {/*        <ViewColumnsIcon className="h-4 w-4 mr-1" />*/}
                                    {/*        Comfortable*/}
                                    {/*    </button>*/}
                                    {/*    <button*/}
                                    {/*        onClick={() => setViewDensity('compact')}*/}
                                    {/*        className={`flex items-center px-3 py-1.5 rounded text-sm transition-colors ${*/}
                                    {/*            viewDensity === 'compact'*/}
                                    {/*                ? 'bg-eerie-black text-white'*/}
                                    {/*                : 'text-black-olive-600 hover:text-eerie-black'*/}
                                    {/*        }`}*/}
                                    {/*    >*/}
                                    {/*        <Squares2X2Icon className="h-4 w-4 mr-1" />*/}
                                    {/*        Compact*/}
                                    {/*    </button>*/}
                                    {/*</div>*/}

                                    {/* Mobile filter toggle */}
                                    <div className="lg:hidden">
                                        <button
                                            onClick={() => setShowFilters(!showFilters)}
                                            className="inline-flex items-center space-x-2 px-6 py-3 bg-eerie-black text-floral-white rounded-lg hover:bg-black-olive transition-colors font-medium shadow-sm"
                                        >
                                            <AdjustmentsHorizontalIcon className="h-5 w-5" />
                                            <span>Filters</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Filters */}
                            {showFilters && (
                                <div className="lg:hidden mb-6">
                                    <FilterSidebar
                                        filters={searchState}
                                        onFilterChange={handleSearch}
                                    />
                                </div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <div className="mb-6 p-6 bg-red-50 border border-red-200 rounded-xl">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-red-800 font-medium">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Seller Grid */}
                            <SellerGrid
                                sellers={sellers}
                                loading={loading}
                                onLoadMore={handleLoadMore}
                                hasMore={pagination.hasMore}
                                viewDensity={viewDensity}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default SellersPage;