import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from '../Navbar'; // Assuming Navbar is in components root
import Footer from '../Footer'; // Assuming Footer is in components root
import { LayoutDashboard, ShoppingBag, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserLayout: React.FC = () => {
    const location = useLocation();
    const { logout } = useAuth();

    const menuItems = [
        { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { path: '/dashboard/orders', label: 'My Orders', icon: ShoppingBag },
        { path: '/dashboard/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />

            <div className="flex-grow container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar / Menu */}
                    <aside className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                            <h2 className="text-xl font-bold font-serif text-gray-800 mb-6">Hello!</h2>
                            <nav className="space-y-2">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path
                                                ? 'bg-saffron/10 text-saffron font-semibold'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <item.icon size={20} />
                                        {item.label}
                                    </Link>
                                ))}
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-4 border-t border-gray-100"
                                >
                                    <LogOut size={20} />
                                    Logout
                                </button>
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        <Outlet />
                    </main>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default UserLayout;
