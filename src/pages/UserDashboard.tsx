import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Package, Calendar, MapPin, Clock } from 'lucide-react';

interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    type: string;
    variant?: string;
}

interface Order {
    id: string;
    createdAt: any;
    total: number;
    status: string;
    items: OrderItem[];
    shippingDetails: {
        address: string;
        city: string;
        zip: string;
    };
}

const UserDashboard: React.FC = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;
            try {
                const q = query(
                    collection(db, 'orders'),
                    where('userId', '==', user.uid),
                    orderBy('createdAt', 'desc')
                );
                const querySnapshot = await getDocs(q);
                const ordersData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Order[];
                setOrders(ordersData);
            } catch (error) {
                console.error("Error fetching orders", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user]);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'shipped': return 'bg-purple-100 text-purple-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold font-serif text-gray-900">My Orders</h1>

            {orders.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
                    <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package size={32} className="text-saffron" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-500 mb-6">Start shopping to see your orders here.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="bg-gray-50 px-6 py-4 flex flex-wrap gap-4 justify-between items-center border-b border-gray-100">
                                <div className="flex flex-wrap gap-6 text-sm">
                                    <div>
                                        <span className="block text-gray-500 mb-1">Order Placed</span>
                                        <span className="font-semibold text-gray-900 flex items-center gap-1">
                                            <Calendar size={14} />
                                            {order.createdAt?.toDate().toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500 mb-1">Total Amount</span>
                                        <span className="font-semibold text-gray-900">₹{order.total}</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500 mb-1">Ship To</span>
                                        <span className="font-semibold text-gray-900 flex items-center gap-1">
                                            <MapPin size={14} />
                                            {order.shippingDetails.city}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1 ${getStatusColor(order.status)}`}>
                                        <Clock size={12} />
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="space-y-4">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                                            />
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900">{item.name}</h4>
                                                {item.variant && <p className="text-sm text-gray-500">Variant: {item.variant}</p>}
                                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                            <div className="font-semibold text-gray-900">
                                                ₹{item.price * item.quantity}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
