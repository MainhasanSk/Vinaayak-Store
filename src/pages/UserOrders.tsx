import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { Package, Calendar, MapPin, CreditCard, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    type: 'product' | 'service' | 'package';
    bookingDetails?: {
        date: string;
        time: string;
        venue: string;
    };
}

interface Order {
    id: string;
    items: OrderItem[];
    total: number;
    status: string;
    createdAt: any;
    shippingDetails: {
        name: string;
        phone: string;
        address: string;
        city: string;
        zip: string;
    };
    paymentMethod: string;
}

const UserOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchOrders();
    }, [user]);

    const fetchOrders = async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            // Query without orderBy to avoid needing a composite index
            // We'll sort in JavaScript instead
            const ordersQuery = query(
                collection(db, 'orders'),
                where('userId', '==', user.uid)
            );
            const snapshot = await getDocs(ordersQuery);
            const ordersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Order[];

            // Sort by createdAt in JavaScript
            ordersData.sort((a, b) => {
                if (!a.createdAt || !b.createdAt) return 0;
                return b.createdAt.toMillis() - a.createdAt.toMillis();
            });

            setOrders(ordersData);
        } catch (error: any) {
            console.error('Error fetching orders:', error);
            toast.error(`Failed to load orders: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'processing':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'shipped':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'delivered':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20 pb-12">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Please Login</h1>
                    <p className="text-gray-600 mb-6">You need to be logged in to view your orders.</p>
                    <Link to="/login" className="bg-saffron text-white px-6 py-3 rounded-lg font-semibold hover:bg-saffron-dark transition">
                        Login
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20 pb-12 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                    <p className="text-gray-600 mt-2">View and track your orders</p>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <Package size={64} className="mx-auto text-gray-400 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
                        <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
                        <Link to="/shop" className="bg-saffron text-white px-6 py-3 rounded-lg font-semibold hover:bg-saffron-dark transition inline-block">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                                {/* Order Header */}
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Order ID</p>
                                                <p className="font-mono font-semibold text-gray-900">#{order.id.slice(0, 8)}</p>
                                            </div>
                                            <div className="h-8 w-px bg-gray-300"></div>
                                            <div>
                                                <p className="text-sm text-gray-500">Date</p>
                                                <p className="font-semibold text-gray-900 flex items-center gap-1">
                                                    <Calendar size={16} />
                                                    {order.createdAt?.toDate().toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="h-8 w-px bg-gray-300"></div>
                                            <div>
                                                <p className="text-sm text-gray-500">Total</p>
                                                <p className="font-bold text-saffron text-lg">₹{order.total}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold border ${getStatusColor(order.status)}`}>
                                                {order.status.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-6">
                                    <h3 className="font-bold text-gray-900 mb-4">Order Items</h3>
                                    <div className="space-y-4">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                                                <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                                                    <p className="text-sm text-gray-500 capitalize">Type: {item.type}</p>
                                                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                                    {item.bookingDetails && (
                                                        <div className="mt-2 bg-orange-50 p-2 rounded text-xs space-y-1">
                                                            <p className="font-semibold text-gray-700">Booking Details:</p>
                                                            <div className="flex items-center gap-2">
                                                                <Calendar size={12} className="text-saffron" />
                                                                <span>Date: {item.bookingDetails.date}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Clock size={12} className="text-saffron" />
                                                                <span>Time: {item.bookingDetails.time}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <MapPin size={12} className="text-saffron" />
                                                                <span>Venue: {item.bookingDetails.venue}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-saffron">₹{item.price}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Shipping & Payment Info */}
                                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                                <MapPin size={18} className="text-saffron" />
                                                Shipping Address
                                            </h4>
                                            <p className="text-sm text-gray-700">{order.shippingDetails.name}</p>
                                            <p className="text-sm text-gray-700">{order.shippingDetails.phone}</p>
                                            <p className="text-sm text-gray-700">{order.shippingDetails.address}</p>
                                            <p className="text-sm text-gray-700">{order.shippingDetails.city} - {order.shippingDetails.zip}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                                <CreditCard size={18} className="text-saffron" />
                                                Payment Method
                                            </h4>
                                            <p className="text-sm text-gray-700 capitalize">
                                                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserOrders;
