import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import SellerCard from './SellerCard';
import api from '../../services/api';

const SellersCarousel = () => {
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const scrollContainerRef = React.useRef(null);

    useEffect(() => {
        fetchFeaturedSellers();
    }, []);

    const fetchFeaturedSellers = async () => {
        try {
            setError(null);
            const response = await api.get('/api/v1/profile/featured');

            // Ensure we have an array of sellers
            if (Array.isArray(response.data)) {
                setSellers(response.data);
            } else {
                console.error('Unexpected response format:', response.data);
                setSellers([]);
            }
        } catch (error) {
            console.error('Error fetching sellers:', error);
            setError(error.response?.data?.message || 'Failed to load featured sellers');
            setSellers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="bg-floral-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-eerie-black mb-2">
                            Featured Creative Professionals
                        </h2>
                        <p className="text-black-olive-600">
                            Discover talented professionals ready to bring your vision to life
                        </p>
                    </div>

                    <Link
                        to="/sellers"
                        className="text-flame hover:text-flame-600 font-medium transition-colors duration-200"
                    >
                        View all →
                    </Link>
                </div>

                <div className="relative">
                    {/* Scroll buttons */}
                    {canScrollLeft && sellers.length > 0 && (
                        <button
                            onClick={() => scroll('left')}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-floral-white shadow-lg rounded-full p-2 hover:bg-timberwolf-100 transition-colors duration-200"
                        >
                            <ChevronLeftIcon className="w-5 h-5 text-black-olive" />
                        </button>
                    )}

                    {canScrollRight && sellers.length > 0 && (
                        <button
                            onClick={() => scroll('right')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-floral-white shadow-lg rounded-full p-2 hover:bg-timberwolf-100 transition-colors duration-200"
                        >
                            <ChevronRightIcon className="w-5 h-5 text-black-olive" />
                        </button>
                    )}

                    {/* Sellers carousel */}
                    <div
                        ref={scrollContainerRef}
                        onScroll={handleScroll}
                        className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {loading ? (
                            // Loading skeleton
                            [...Array(4)].map((_, i) => (
                                <div key={i} className="min-w-[280px] h-32 bg-timberwolf-200 rounded-lg animate-pulse" />
                            ))
                        ) : error ? (
                            <div className="text-center py-8 text-red-600 w-full">
                                {error}
                            </div>
                        ) : sellers.length > 0 ? (
                            sellers.map((seller, index) => {
                                // Log to debug
                                console.log(`Seller ${index}:`, seller);

                                return seller ? (
                                    <SellerCard key={seller._id || index} seller={seller} />
                                ) : null;
                            })
                        ) : (
                            <div className="text-center py-8 text-black-olive-600 w-full">
                                <p className="mb-4">No featured sellers at the moment</p>
                                <Link
                                    to="/register"
                                    className="text-flame hover:text-flame-600 font-medium"
                                >
                                    Be the first to join →
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SellersCarousel;