import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

const CheckoutPage: React.FC = () => {
    const { items, total, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: user?.displayName || '',
        phone: '',
        address: '',
        city: '',
        zip: '',
        paymentMethod: 'cod' // Only COD for now
    });

    if (items.length === 0) {
        navigate('/cart');
        return null;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Create Order in Firestore
            const orderData = {
                userId: user?.uid || 'guest',
                userEmail: user?.email || 'guest',
                items: items,
                total: total,
                status: 'pending', // pending, processing, shipped, delivered, cancelled
                shippingDetails: {
                    name: formData.name,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    zip: formData.zip
                },
                paymentMethod: formData.paymentMethod,
                createdAt: serverTimestamp(),
            };

            await addDoc(collection(db, 'orders'), orderData);

            clearCart();
            toast.success('Order placed successfully!');
            navigate('/order-success'); // Need to create this
        } catch (error) {
            console.error("Order error", error);
            toast.error('Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold font-serif text-gray-900 mb-8 text-center">Checkout</h1>

            <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
                {/* Shipping Details */}
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="bg-saffron text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">1</span>
                        Shipping Information
                    </h2>

                    <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saffron outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saffron outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <textarea
                                name="address"
                                required
                                rows={3}
                                value={formData.address}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saffron outline-none"
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    required
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saffron outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Zip / Pin Code</label>
                                <input
                                    type="text"
                                    name="zip"
                                    required
                                    value={formData.zip}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saffron outline-none"
                                />
                            </div>
                        </div>
                    </form>
                </div>

                {/* Right Column: Order Summary & Review */}
                <div className="w-full lg:w-96 space-y-6">
                    {/* Items Review */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="bg-saffron text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">2</span>
                            Review Items
                        </h2>
                        <ul className="space-y-4 max-h-60 overflow-y-auto pr-2">
                            {items.map(item => (
                                <li key={item.id} className="flex gap-4 text-sm">
                                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />
                                    <div className="flex-1">
                                        <p className="font-semibold">{item.name}</p>
                                        {item.customization && item.customization.length > 0 && (
                                            <p className="text-xs text-red-600">
                                                <span className="font-semibold">Excl:</span> {item.customization.join(', ')}
                                            </p>
                                        )}
                                        {item.bookingDetails && (
                                            <div className="text-xs text-gray-600 mt-1 space-y-0.5">
                                                <p><span className="font-semibold">Date:</span> {item.bookingDetails.date}</p>
                                                <p><span className="font-semibold">Time:</span> {item.bookingDetails.time}</p>
                                                <p><span className="font-semibold">Venue:</span> {item.bookingDetails.venue}</p>
                                            </div>
                                        )}
                                        <p className="text-gray-500 text-xs mt-1">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="font-bold">₹{item.price * item.quantity}</div>
                                </li>
                            ))}
                        </ul>
                        <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
                            <span>Total Payble</span>
                            <span>₹{total}</span>
                        </div>
                    </div>

                    {/* Payment & Submit */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                        <div className="mb-6">
                            <label className="flex items-center gap-3 p-3 border rounded-lg bg-orange-50 border-saffron cursor-pointer">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="cod"
                                    checked={formData.paymentMethod === 'cod'}
                                    onChange={handleInputChange}
                                    className="text-saffron focus:ring-saffron"
                                />
                                <span className="font-bold text-gray-900">Cash on Delivery</span>
                            </label>
                            <p className="text-xs text-gray-500 mt-2 ml-1">Pay when you receive your items.</p>
                        </div>

                        <button
                            type="submit"
                            form="checkout-form"
                            disabled={loading}
                            className="w-full bg-saffron hover:bg-saffron-dark text-white font-bold py-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                'Place Order'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
