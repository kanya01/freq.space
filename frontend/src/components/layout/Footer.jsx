import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-eerie-black text-timberwolf relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-eerie-black via-black-olive to-eerie-black"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="mb-6">
                            <h3 className="text-floral-white font-bold text-2xl mb-3">
                                freq.space
                            </h3>
                            <p className="text-timberwolf-400 text-lg leading-relaxed">
                                Empowering Your Creative Journey
                            </p>
                        </div>
                        <p className="text-timberwolf-600 text-sm leading-relaxed">
                            Connect with talented professionals, showcase your skills, and bring your creative vision to life in our thriving community.
                        </p>
                    </div>

                    {/* Platform Links */}
                    <div>
                        <h4 className="text-floral-white font-semibold mb-6 text-lg">Platform</h4>
                        <ul className="space-y-4 text-sm">
                            <li>
                                <Link to="/sellers" className="text-timberwolf-400 hover:text-floral-white transition-colors duration-200 flex items-center group">
                                    <span className="group-hover:translate-x-1 transition-transform duration-200">Find Professionals</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/hire" className="text-timberwolf-400 hover:text-floral-white transition-colors duration-200 flex items-center group">
                                    <span className="group-hover:translate-x-1 transition-transform duration-200">Hire a Service</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/sell" className="text-timberwolf-400 hover:text-floral-white transition-colors duration-200 flex items-center group">
                                    <span className="group-hover:translate-x-1 transition-transform duration-200">Sell a Service</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="text-timberwolf-400 hover:text-floral-white transition-colors duration-200 flex items-center group">
                                    <span className="group-hover:translate-x-1 transition-transform duration-200">Join Community</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="text-floral-white font-semibold mb-6 text-lg">Company</h4>
                        <ul className="space-y-4 text-sm">
                            <li>
                                <Link to="/about" className="text-timberwolf-400 hover:text-floral-white transition-colors duration-200 flex items-center group">
                                    <span className="group-hover:translate-x-1 transition-transform duration-200">About Us</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/blog" className="text-timberwolf-400 hover:text-floral-white transition-colors duration-200 flex items-center group">
                                    <span className="group-hover:translate-x-1 transition-transform duration-200">Blog</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-timberwolf-400 hover:text-floral-white transition-colors duration-200 flex items-center group">
                                    <span className="group-hover:translate-x-1 transition-transform duration-200">Contact</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/help" className="text-timberwolf-400 hover:text-floral-white transition-colors duration-200 flex items-center group">
                                    <span className="group-hover:translate-x-1 transition-transform duration-200">Help Center</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h4 className="text-floral-white font-semibold mb-6 text-lg">Legal</h4>
                        <ul className="space-y-4 text-sm">
                            <li>
                                <Link to="/privacy" className="text-timberwolf-400 hover:text-floral-white transition-colors duration-200 flex items-center group">
                                    <span className="group-hover:translate-x-1 transition-transform duration-200">Privacy Policy</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms" className="text-timberwolf-400 hover:text-floral-white transition-colors duration-200 flex items-center group">
                                    <span className="group-hover:translate-x-1 transition-transform duration-200">Terms of Service</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/cookies" className="text-timberwolf-400 hover:text-floral-white transition-colors duration-200 flex items-center group">
                                    <span className="group-hover:translate-x-1 transition-transform duration-200">Cookie Policy</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-black-olive-600 mt-12 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-timberwolf-600 text-sm">
                            &copy; 2024 freq.space. All rights reserved.
                        </p>
                        <div className="flex items-center space-x-6 text-sm">
                            <span className="text-timberwolf-600">Made with ❤️ for creatives</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;