import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Layers,
    Gift,
    Calendar,
    LogOut,
    X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
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

    const sidebarContent = (
        <div className="bg-saffron-dark text-white w-64 min-h-screen flex flex-col shadow-xl">
            <div className="p-6 border-b border-orange-600 flex justify-between items-center">
                <h2 className="text-2xl font-bold font-serif">Vinayak Admin</h2>
                <button onClick={onClose} className="lg:hidden text-white/80 hover:text-white">
                    <X size={24} />
                </button>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => {
                            if (window.innerWidth < 1024) onClose();
                        }}
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
                    onClick={() => {
                        logout();
                        onClose();
                    }}
                    className="flex items-center gap-3 px-4 py-3 w-full text-orange-100 hover:bg-orange-600 rounded-lg transition-colors"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex">
                {sidebarContent}
            </div>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 z-50 lg:hidden"
                        >
                            {sidebarContent}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
