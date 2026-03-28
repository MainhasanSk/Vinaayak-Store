import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const BottomNav: React.FC = () => {
    const location = useLocation();
    const { cartCount } = useCart();
    const { user } = useAuth();

    const navItems = [
        { label: 'Home', path: '/', icon: Home },
        { label: 'Shop', path: '/shop', icon: ShoppingBag },
        { label: 'Cart', path: '/cart', icon: ShoppingCart, badge: cartCount },
        { label: 'Account', path: user ? '/dashboard' : '/login', icon: User },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 flex justify-around items-center z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;

                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex flex-col items-center justify-center space-y-1 px-3 py-1 rounded-lg transition-colors ${isActive ? 'text-saffron' : 'text-gray-500 hover:text-saffron'
                            }`}
                    >
                        <div className="relative">
                            <Icon size={24} className={isActive ? 'fill-saffron/10' : ''} />
                            {item.badge !== undefined && item.badge > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center border-2 border-white">
                                    {item.badge}
                                </span>
                            )}
                        </div>
                        <span className="text-[10px] font-medium leading-none">{item.label}</span>
                    </Link>
                );
            })}
        </div>
    );
};

export default BottomNav;
