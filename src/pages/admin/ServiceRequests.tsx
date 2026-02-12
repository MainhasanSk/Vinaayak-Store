import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Calendar, Clock, MapPin, Package } from 'lucide-react';
import toast from 'react-hot-toast';

interface BookingDetails {
    date: string;
    time: string;
    venue: string;
}

interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    type: 'product' | 'service' | 'package';
    bookingDetails?: BookingDetails;
    customization?: string[];
}

interface Order {
    id: string;
    userId: string;
    userEmail: string;
    items: CartItem[];
    total: number;
    status: string;
    shippingDetails: {
        name: string;
        phone: string;
        address: string;
        city: string;
        zip: string;
    };
    createdAt: any;
}

const ServiceRequests: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchServiceRequests();
    }, []);

    const fetchServiceRequests = async () => {
        try {
            const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const ordersData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Order[];

            // Filter orders that contain at least one service item
            const serviceOrders = ordersData.filter(order =>
                order.items.some(item => item.type === 'service')
            );

            setOrders(serviceOrders);
        } catch (error) {
            console.error('Error fetching service requests:', error);
            toast.error('Failed to load service requests');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (timestamp: any) => {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Service Requests</h1>
                <div className="text-sm text-gray-500">
                    Total Requests: <span className="font-bold text-gray-900">{orders.length}</span>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <Package size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No service requests found</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Order Header */}
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                <div className="flex flex-wrap justify-between items-center gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Order ID</p>
                                        <p className="font-mono font-semibold text-gray-900">{order.id.slice(0, 8)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Order Date</p>
                                        <p className="font-semibold text-gray-900">{formatDate(order.createdAt)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Customer</p>
                                        <p className="font-semibold text-gray-900">{order.shippingDetails.name}</p>
                                        <p className="text-xs text-gray-500">{order.shippingDetails.phone}</p>
                                    </div>
                                    <div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                            {order.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Service Items */}
                            <div className="p-6">
                                <h3 className="font-bold text-gray-800 mb-4">Service Details</h3>
                                <div className="space-y-4">
                                    {order.items
                                        .filter(item => item.type === 'service')
                                        .map((item, idx) => (
                                            <div key={idx} className="flex gap-4 p-4 bg-orange-50 rounded-lg border border-orange-100">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-20 h-20 rounded object-cover"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-gray-900 mb-2">{item.name}</h4>
                                                    {item.customization && item.customization.length > 0 && (
                                                        <p className="text-xs text-red-600 mb-2">
                                                            <span className="font-semibold">Excluded:</span> {item.customization.join(', ')}
                                                        </p>
                                                    )}
                                                    {item.bookingDetails && (
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                                                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                                                <Calendar size={16} className="text-saffron" />
                                                                <span><strong>Date:</strong> {item.bookingDetails.date}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                                                <Clock size={16} className="text-saffron" />
                                                                <span><strong>Time:</strong> {item.bookingDetails.time}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                                                <MapPin size={16} className="text-saffron" />
                                                                <span><strong>Venue:</strong> {item.bookingDetails.venue}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-500">Price</p>
                                                    <p className="text-xl font-bold text-saffron">₹{item.price}</p>
                                                </div>
                                            </div>
                                        ))}
                                </div>

                                {/* Customer Contact */}
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <h4 className="font-bold text-gray-800 mb-3">Contact Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-500">Phone</p>
                                            <p className="font-semibold text-gray-900">{order.shippingDetails.phone}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Email</p>
                                            <p className="font-semibold text-gray-900">{order.userEmail}</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <p className="text-gray-500">Address</p>
                                            <p className="font-semibold text-gray-900">
                                                {order.shippingDetails.address}, {order.shippingDetails.city} - {order.shippingDetails.zip}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ServiceRequests;
