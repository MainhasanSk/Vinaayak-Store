import React from 'react';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Brand Info */}
                    <div>
                        <h2 className="text-2xl font-bold font-serif text-saffron mb-4">Vinayak Store</h2>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Your trusted partner for all devotional needs. From fresh flowers to complete puja packages, we ensure purity and devotion in every delivery.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-saffron hover:text-white transition">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-saffron hover:text-white transition">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-saffron hover:text-white transition">
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Quick Links</h3>
                        <ul className="space-y-3">
                            <li><Link to="/" className="text-gray-400 hover:text-saffron transition">Home</Link></li>
                            <li><Link to="/shop" className="text-gray-400 hover:text-saffron transition">Shop Products</Link></li>
                            <li><Link to="/services" className="text-gray-400 hover:text-saffron transition">Decoration Services</Link></li>
                            <li><Link to="/packages" className="text-gray-400 hover:text-saffron transition">Puja Packages</Link></li>
                            <li><Link to="/about" className="text-gray-400 hover:text-saffron transition">About Us</Link></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Categories</h3>
                        <ul className="space-y-3">
                            <li><Link to="/shop?cat=flowers" className="text-gray-400 hover:text-saffron transition">Fresh Flowers</Link></li>
                            <li><Link to="/shop?cat=essentials" className="text-gray-400 hover:text-saffron transition">Pooja Essentials</Link></li>
                            <li><Link to="/services?cat=wedding" className="text-gray-400 hover:text-saffron transition">Wedding Decoration</Link></li>
                            <li><Link to="/services?cat=birthday" className="text-gray-400 hover:text-saffron transition">Birthday Decoration</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="text-saffron mt-1" size={20} />
                                <span className="text-gray-400">123 Devotion Street, Spiritual Area, City Name, India - 700001</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="text-saffron" size={20} />
                                <span className="text-gray-400">+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="text-saffron" size={20} />
                                <span className="text-gray-400">contact@vinayakstore.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} Vinayak Store. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
