import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout, isAdmin } = useAuth();
    const { cartCount } = useCart();
    const location = useLocation();

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/shop', label: 'Shop' },
        { path: '/services', label: 'Decoration Services' },
        { path: '/packages', label: 'Puja Packages' },
    ];

    return (
        <nav className="bg-gradient-to-r from-saffron to-saffron-dark text-white sticky top-0 z-50 shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
                        <div className="bg-white p-1 rounded-full">
                            {/* Fallback icon if logo not available */}
                            <img src="/src/assets/logo.svg" alt="VS" className="h-10 w-10 object-contain rounded-full" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                            {/* <div className="h-8 w-8 bg-saffron rounded-full flex items-center justify-center text-white font-bold text-xs" >VS</div> */}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold font-serif tracking-wide leading-none">Vinayak</h1>
                            <span className="text-xs text-yellow-200 tracking-wider">STORE & SERVICES</span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`text-sm font-medium transition-colors hover:text-yellow-200 ${location.pathname === link.path ? 'text-yellow-200 border-b-2 border-yellow-200' : ''
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Icons & Mobile Menu Button */}
                    <div className="flex items-center gap-4">
                        <Link to="/cart" className="relative hover:text-yellow-200 transition">
                            <ShoppingCart size={24} />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-saffron">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="relative group">
                                <button className="flex items-center gap-2 hover:text-yellow-200">
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt={user.displayName || 'User'} className="h-8 w-8 rounded-full border-2 border-white" />
                                    ) : (
                                        <User size={24} />
                                    )}
                                </button>
                                {/* Dropdown */}
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl py-2 text-gray-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-sm font-semibold truncate">{user.displayName || 'User'}</p>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    </div>
                                    {isAdmin ? (
                                        <Link to="/admin" className="block px-4 py-2 text-sm hover:bg-orange-50 hover:text-saffron">Admin Dashboard</Link>
                                    ) : (
                                        <Link to="/dashboard" className="block px-4 py-2 text-sm hover:bg-orange-50 hover:text-saffron">My Orders</Link>
                                    )}

                                    <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                        <LogOut size={14} /> Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="hidden md:block bg-white text-saffron-dark px-4 py-2 rounded-full font-bold text-sm hover:bg-yellow-50 transition shadow-sm">
                                Login
                            </Link>
                        )}

                        <button className="md:hidden text-white" onClick={toggleMenu}>
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden bg-saffron-dark overflow-hidden"
                    >
                        <div className="px-4 py-4 space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={closeMenu}
                                    className="block text-white hover:text-yellow-200 font-medium border-b border-saffron/30 pb-2"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            {!user && (
                                <Link to="/login" onClick={closeMenu} className="block text-center bg-white text-saffron-dark py-2 rounded-lg font-bold">
                                    Login / Register
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
