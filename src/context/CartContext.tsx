import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    type: 'product' | 'service' | 'package';
    variant?: string; // For services
    customization?: string[]; // For packages/services
    bookingDetails?: {
        date: string;
        time: string;
        venue: string;
    };
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string, variant?: string) => void;
    updateQuantity: (id: string, quantity: number, variant?: string) => void;
    clearCart: () => void;
    total: number;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (newItem: CartItem) => {
        setItems(prev => {
            // For services with booking details, treat each booking as unique
            // (different date/time/venue = different booking)
            if (newItem.type === 'service' && newItem.bookingDetails) {
                // Services with booking details are always added as new items
                toast.success(`Added ${newItem.name} to cart`);
                return [...prev, newItem];
            }

            // For products and services without booking details, check for duplicates
            const existing = prev.find(item =>
                item.id === newItem.id && item.variant === newItem.variant
            );

            if (existing) {
                toast.success(`Updated ${newItem.name} quantity`);
                return prev.map(item =>
                    (item.id === newItem.id && item.variant === newItem.variant)
                        ? { ...item, quantity: item.quantity + newItem.quantity }
                        : item
                );
            }

            toast.success(`Added ${newItem.name} to cart`);
            return [...prev, newItem];
        });
    };

    const removeFromCart = (id: string, variant?: string) => {
        setItems(prev => prev.filter(item => !(item.id === id && item.variant === variant)));
        toast.error('Item removed from cart');
    };

    const updateQuantity = (id: string, quantity: number, variant?: string) => {
        if (quantity < 1) return;
        setItems(prev => prev.map(item =>
            (item.id === id && item.variant === variant)
                ? { ...item, quantity }
                : item
        ));
    };

    const clearCart = () => {
        setItems([]);
    };

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};
