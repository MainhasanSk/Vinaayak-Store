import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

const CartPage: React.FC = () => {
    const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="bg-orange-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag size={48} className="text-saffron" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
                <Link to="/shop" className="bg-saffron hover:bg-saffron-dark text-white font-bold py-3 px-8 rounded-full shadow-lg transition">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold font-serif text-gray-900 mb-8">Shopping Cart</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items List */}
                <div className="flex-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="divide-y divide-gray-100">
                            {items.map((item) => (
                                <div key={`${item.id}-${item.variant}`} className="p-6 flex flex-col sm:flex-row items-center gap-6">
                                    <div className="h-24 w-24 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                                        <img
                                            src={item.image || 'https://via.placeholder.com/150'}
                                            alt={item.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="font-bold text-gray-900">{item.name}</h3>
                                        {item.customization && item.customization.length > 0 && (
                                            <div className="text-xs text-red-600 mt-1">
                                                <span className="font-semibold">Removed:</span> {item.customization.join(', ')}
                                            </div>
                                        )}
                                        {item.variant && !item.variant.startsWith('custom-') && <p className="text-sm text-gray-500">Variant: {item.variant}</p>}
                                        <div className="text-xs uppercase font-bold text-saffron mt-1 tracking-wider">{item.type}</div>
                                    </div>

                                    <div className="flex items-center border border-gray-200 rounded-lg">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant)}
                                            className="p-2 hover:bg-gray-50 text-gray-500"
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="w-10 text-center font-medium">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant)}
                                            className="p-2 hover:bg-gray-50 text-gray-500"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>

                                    <div className="text-lg font-bold text-gray-900 w-24 text-right">
                                        ₹{item.price * item.quantity}
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item.id, item.variant)}
                                        className="text-gray-400 hover:text-red-500 transition"
                                        title="Remove Item"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={clearCart}
                        className="mt-6 text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-2"
                    >
                        <Trash2 size={16} /> Clear Cart
                    </button>
                </div>

                {/* Order Summary */}
                <div className="w-full lg:w-96">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-24">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 border-b pb-4">Order Summary</h3>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{total}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span className="text-green-600 font-medium">Free</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-gray-900 pt-4 border-t">
                                <span>Total</span>
                                <span>₹{total}</span>
                            </div>
                        </div>

                        <Link to="/checkout" className="w-full bg-saffron hover:bg-saffron-dark text-white font-bold py-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2">
                            Proceed to Checkout <ArrowRight size={20} />
                        </Link>

                        <div className="mt-4 text-center">
                            <Link to="/shop" className="text-sm text-gray-500 hover:text-saffron">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
