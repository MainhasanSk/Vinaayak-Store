import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Layers,
    Gift,
    Calendar,
    LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar: React.FC = () => {
    const location = useLocation();
    const { logout } = useAuth();

    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/products', label: 'Products', icon: Package },
        { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
        { path: '/admin/services', label: 'Services', icon: Layers },
        { path: '/admin/packages', label: 'Packages', icon: Gift },
        { path: '/admin/service-requests', label: 'Service Requests', icon: Calendar },
    ];

    return (
        <div className="bg-saffron-dark text-white w-64 min-h-screen flex flex-col shadow-xl">
            <div className="p-6 border-b border-orange-600">
                <h2 className="text-2xl font-bold font-serif">Vinayak Admin</h2>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive(item.path)
                            ? 'bg-white text-saffron-dark font-semibold shadow-sm'
                            : 'text-orange-100 hover:bg-orange-600'
                            }`}
                    >
                        <item.icon size={20} />
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-orange-600">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-orange-100 hover:bg-orange-600 rounded-lg transition-colors"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
