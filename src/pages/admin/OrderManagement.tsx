import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, getDocs, orderBy, updateDoc, doc } from 'firebase/firestore';
import { Package, MapPin, User, Phone, Eye, MessageCircle, X, Calendar, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

interface Order {
    id: string;
    userId: string;
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
    items: any[];
    paymentMethod: string;
}

const OrderManagement: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const ordersData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Order[];
            setOrders(ordersData);
        } catch (error) {
            console.error("Error fetching orders", error);
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId: string, newStatus: string) => {
        try {
            const orderRef = doc(db, 'orders', orderId);
            await updateDoc(orderRef, { status: newStatus });
            toast.success(`Order status updated to ${newStatus}`);
            fetchOrders(); // Refresh list
        } catch (error) {
            console.error("Error updating status", error);
            toast.error("Failed to update status");
        }
    };

    const sendWhatsAppUpdate = (order: Order) => {
        const phone = order.shippingDetails.phone.replace(/\D/g, ''); // Remove non-digits
        const message = `Hello ${order.shippingDetails.name}! 

Your order #${order.id.slice(0, 8)} status: *${order.status.toUpperCase()}*

Order Total: ₹${order.total}
Items: ${order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}

Thank you for shopping with Vinayak Store!`;

        const whatsappUrl = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        toast.success('Opening WhatsApp...');
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const openOrderDetails = (order: Order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Order Management</h1>

            {loading ? (
                <div className="flex justify-center p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron"></div>
                </div>
            ) : orders.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">No orders found</h3>
                    <p className="text-gray-500">When customers place orders, they will appear here.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            {/* Order Header */}
                            <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-gray-900">#{order.id.slice(0, 8)}...</span>
                                        <span className="text-xs text-gray-500">
                                            {order.createdAt?.toDate().toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                                        <User size={14} /> {order.shippingDetails.name}
                                        <span className="mx-1">•</span>
                                        <Phone size={14} /> {order.shippingDetails.phone}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <select
                                        value={order.status}
                                        onChange={(e) => updateStatus(order.id, e.target.value)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-bold border outline-none cursor-pointer focus:ring-2 focus:ring-opacity-50 ${getStatusColor(order.status)}`}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                    <button
                                        onClick={() => openOrderDetails(order)}
                                        className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition"
                                    >
                                        <Eye size={16} />
                                        View Details
                                    </button>
                                    <button
                                        onClick={() => sendWhatsAppUpdate(order)}
                                        className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition"
                                    >
                                        <MessageCircle size={16} />
                                        WhatsApp
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 flex flex-col lg:flex-row gap-8">
                                {/* Items List */}
                                <div className="flex-1 space-y-3">
                                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Items Ordered</h4>
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg">
                                            <div className="h-10 w-10 bg-white rounded overflow-hidden shadow-sm">
                                                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                            </div>
                                            <div className="flex-1 text-sm">
                                                <p className="font-semibold text-gray-900">{item.name}</p>
                                                {item.customization && item.customization.length > 0 && (
                                                    <div className="text-xs text-red-600 mt-1">
                                                        <span className="font-semibold">Excluded Items:</span> {item.customization.join(', ')}
                                                    </div>
                                                )}
                                                {item.variant && !item.variant.startsWith('custom-') && <span className="text-xs text-gray-500 block">{item.variant}</span>}
                                            </div>
                                            <div className="text-right text-sm">
                                                <p className="font-semibold">x{item.quantity}</p>
                                                <p className="text-xs text-gray-500">₹{item.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="flex justify-between items-center pt-2 border-t mt-2">
                                        <span className="font-bold text-gray-700">Total Amount</span>
                                        <span className="font-bold text-xl text-saffron-dark">₹{order.total}</span>
                                    </div>
                                </div>

                                {/* Shipping Info */}
                                <div className="lg:w-80 flex-shrink-0 bg-gray-50 p-4 rounded-xl h-fit">
                                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Shipping Details</h4>
                                    <div className="space-y-3 text-sm text-gray-700">
                                        <p className="flex items-start gap-2">
                                            <MapPin size={16} className="mt-0.5 text-gray-400" />
                                            <span>
                                                {order.shippingDetails.address}<br />
                                                {order.shippingDetails.city} - {order.shippingDetails.zip}
                                            </span>
                                        </p>
                                        <div className="pt-3 border-t border-gray-200">
                                            <p className="font-bold text-gray-900 mb-1">Payment Method</p>
                                            <p className="capitalize text-gray-600">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Order Details Modal */}
            {showModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-saffron text-white px-6 py-4 flex justify-between items-center border-b">
                            <h2 className="text-2xl font-bold">Order Details #{selectedOrder.id.slice(0, 8)}</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-orange-600 rounded-full transition"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6">
                            {/* Order Info */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500 mb-1">Order ID</p>
                                    <p className="font-mono font-bold text-gray-900">{selectedOrder.id}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500 mb-1">Order Date</p>
                                    <p className="font-bold text-gray-900">{selectedOrder.createdAt?.toDate().toLocaleString()}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500 mb-1">Status</p>
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(selectedOrder.status)}`}>
                                        {selectedOrder.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            {/* Customer Details */}
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h3 className="font-bold text-gray-800 mb-3">Customer Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <p className="text-gray-500">Name</p>
                                        <p className="font-semibold text-gray-900">{selectedOrder.shippingDetails.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Phone</p>
                                        <p className="font-semibold text-gray-900">{selectedOrder.shippingDetails.phone}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <p className="text-gray-500">Address</p>
                                        <p className="font-semibold text-gray-900">
                                            {selectedOrder.shippingDetails.address}, {selectedOrder.shippingDetails.city} - {selectedOrder.shippingDetails.zip}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Items Details */}
                            <div>
                                <h3 className="font-bold text-gray-800 mb-3">Order Items</h3>
                                <div className="space-y-3">
                                    {selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex gap-4">
                                                <img src={item.image} alt={item.name} className="w-20 h-20 rounded object-cover" />
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-gray-900">{item.name}</h4>
                                                    <p className="text-sm text-gray-600">Type: <span className="capitalize">{item.type}</span></p>
                                                    {item.customization && item.customization.length > 0 && (
                                                        <p className="text-xs text-red-600 mt-1">
                                                            <span className="font-semibold">Excluded:</span> {item.customization.join(', ')}
                                                        </p>
                                                    )}
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
                                                    <p className="text-sm text-gray-500">Quantity</p>
                                                    <p className="font-bold text-lg">{item.quantity}</p>
                                                    <p className="text-sm text-gray-500 mt-2">Price</p>
                                                    <p className="font-bold text-saffron">₹{item.price}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Payment Summary */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600">Payment Method</span>
                                    <span className="font-semibold capitalize">{selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : selectedOrder.paymentMethod}</span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-gray-300">
                                    <span className="text-xl font-bold text-gray-800">Total Amount</span>
                                    <span className="text-2xl font-bold text-saffron">₹{selectedOrder.total}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => sendWhatsAppUpdate(selectedOrder)}
                                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition"
                                >
                                    <MessageCircle size={20} />
                                    Send WhatsApp Update
                                </button>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-bold transition"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;
