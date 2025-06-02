import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-eerie-black text-timberwolf">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <h3 className="text-floral-white font-semibold text-xl mb-4">
                            freq.space
                        </h3>
                        <p className="text-timberwolf-600 text-sm">
                            Empowering Your Creative Journey
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-floral-white font-medium mb-4">Platform</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/hire" className="hover:text-floral-white transition-colors duration-200">
                                    Hire a Service
                                </Link>
                            </li>
                            <li>
                                <Link to="/sell" className="hover:text-floral-white transition-colors duration-200">
                                    Sell a Service
                                </Link>
                            </li>
                            <li>
                                <Link to="/artists" className="hover:text-floral-white transition-colors duration-200">
                                    Browse Artists
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-floral-white font-medium mb-4">Company</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/about" className="hover:text-floral-white transition-colors duration-200">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/blog" className="hover:text-floral-white transition-colors duration-200">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:text-floral-white transition-colors duration-200">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-floral-white font-medium mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/privacy" className="hover:text-floral-white transition-colors duration-200">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms" className="hover:text-floral-white transition-colors duration-200">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-black-olive-600 mt-8 pt-8 text-center text-sm text-timberwolf-600">
                    <p>&copy; 2024 freq.space. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;