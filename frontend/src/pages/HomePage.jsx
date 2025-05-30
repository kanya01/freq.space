import React from 'react';
import Header from '../components/layout/Header';
import StoryPreview from '../components/home/StoryPreview';
import SellersCarousel from '../components/home/SellersCarousel';
import Footer from '../components/layout/Footer';

function HomePage() {
    return (
        <div className="min-h-screen bg-floral-white">
            <Header />

            <main>
                {/* Hero Section - Redesigned for better visibility and elegance */}
                <section className="bg-floral-white relative overflow-hidden">
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-timberwolf-100 opacity-50"></div>

                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-flame-900 rounded-full filter blur-3xl opacity-10 translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-timberwolf-300 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 translate-y-1/2"></div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
                        <div className="text-center">
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-eerie-black mb-6 tracking-tight">
                                The Marketplace for
                                <span className="block text-black-olive">Creative Professionals</span>
                            </h1>

                            <p className="text-xl md:text-2xl text-black-olive-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                                Connect with talented professionals, showcase your skills, and bring your creative vision to life.
                            </p>

                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <button className="group relative px-8 py-4 bg-eerie-black text-floral-white rounded-lg hover:bg-black-olive transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                    Get Started
                                    <span className="absolute inset-0 rounded-lg bg-flame opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                                </button>

                                <button className="px-8 py-4 bg-transparent border-2 border-black-olive-300 text-black-olive rounded-lg hover:border-black-olive hover:bg-black-olive-100 transition-all duration-300 font-medium text-lg">
                                    Learn More
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Story Preview Section */}
                <StoryPreview />

                {/* Sellers Carousel */}
                <SellersCarousel />
            </main>

            <Footer />
        </div>
    );
}

export default HomePage;