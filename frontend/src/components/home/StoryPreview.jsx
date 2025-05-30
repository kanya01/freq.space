import React from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const StoryPreview = () => {
    return (
        <section className="bg-timberwolf-100 py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    {/* Left side - Story content */}
                    <div className="space-y-6">
                        <h2 className="text-4xl lg:text-5xl font-bold text-floral-white leading-tight">
                            Empowering Your Creative Journey
                        </h2>
                        <p className="text-2xl text-floral-white-200 font-medium">
                            Connect. Create. Captivate.
                        </p>
                        <p className="text-lg text-black-olive-700 leading-relaxed">
                            At freq.space, we're building more than just a marketplace - we're creating a
                            community where musicians can thrive. Whether you're looking to hire top talent
                            for your next project or showcase your skills to the world, we're here to
                            amplify your creative potential.
                        </p>
                        <button className="inline-flex items-center space-x-2 text-black-olive hover:text-flame-600 font-medium transition-colors duration-200 group">
                            <span className="text-lg">Read the full story</span>
                            <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                        </button>
                    </div>

                    {/* Right side - Visual element */}
                    <div className="relative">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                            <div className="aspect-w-16 aspect-h-12 bg-gradient-to-br from-floral-white via-timberwolf-200 to-timberwolf-300">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center p-8">
                                        <div className="inline-flex items-center justify-center w-24 h-24 bg-black-olive rounded-full mb-6">
                                            <span className="text-5xl">🎵</span>
                                        </div>
                                        <p className="text-eerie-black text-xl font-semibold">
                                            Your Creative Journey
                                        </p>
                                        <p className="text-black-olive-600 mt-2">
                                            Starts Here
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Decorative accent */}
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-flame-100 rounded-full opacity-50 blur-xl"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StoryPreview;