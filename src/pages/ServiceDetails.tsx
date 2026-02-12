import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ArrowLeft, Check, ShoppingCart, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

interface ServiceItem {
    name: string;
    price: number;
    removePrice: number;
    image?: string;
}

interface Service {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    category: string;
    items?: ServiceItem[];
    decorationCharge?: number;
}

const ServiceDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);
    const [removedItems, setRemovedItems] = useState<number[]>([]);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingTime, setBookingTime] = useState('');
    const [bookingVenue, setBookingVenue] = useState('');
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchService = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, 'services', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setService({ id: docSnap.id, ...docSnap.data() } as Service);
                }
            } catch (error) {
                console.error(error);
                toast.error('Failed to load service details');
            } finally {
                setLoading(false);
            }
        };
        fetchService();
    }, [id]);

    const toggleItemRemoval = (index: number) => {
        if (removedItems.includes(index)) {
            setRemovedItems(removedItems.filter(i => i !== index));
        } else {
            setRemovedItems([...removedItems, index]);
        }
    };

    const calculateDynamicPrice = () => {
        if (!service) return 0;
        let price = service.price;

        // Subtract removed items
        if (service.items) {
            removedItems.forEach(index => {
                const item = service.items![index];
                if (item) {
                    price -= (item.removePrice || 0);
                }
            });
        }

        // Add Decoration Charge
        if (service.decorationCharge) {
            price += service.decorationCharge;
        }

        return Math.max(0, price);
    };

    const handleAddToCart = () => {
        if (!service) return;

        // Validate booking details
        if (!bookingDate || !bookingTime || !bookingVenue) {
            toast.error('Please fill in Date, Time, and Venue for your service booking');
            return;
        }

        const finalPrice = calculateDynamicPrice();
        const removedNames = service.items
            ?.filter((_, index) => removedItems.includes(index))
            .map(item => item.name);

        addToCart({
            id: service.id,
            name: service.name,
            price: finalPrice,
            image: service.image,
            quantity: 1,
            type: 'service',
            customization: removedNames && removedNames.length > 0 ? removedNames : undefined,
            bookingDetails: {
                date: bookingDate,
                time: bookingTime,
                venue: bookingVenue
            }
        });
        toast.success('Added to cart successfully!');
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron"></div>
            </div>
        );
    }

    if (!service) {
        return (
            <div className="min-h-screen pt-20 px-4 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Service Not Found</h2>
                <Link to="/services" className="text-saffron hover:underline">Back to Services</Link>
            </div>
        );
    }

    const dynamicPrice = calculateDynamicPrice();
    const originalPrice = service.price + (service.decorationCharge || 0);
    const savings = originalPrice - dynamicPrice;

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to="/services" className="inline-flex items-center text-gray-600 hover:text-saffron mb-6 transition">
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Services
                </Link>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Image Section */}
                        <div className="h-96 lg:h-auto relative">
                            <img
                                src={service.image}
                                alt={service.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Content Section */}
                        <div className="p-8 lg:p-12 flex flex-col">
                            <div className="mb-6">
                                <span className="inline-block px-3 py-1 bg-orange-100 text-saffron text-sm font-semibold rounded-full mb-3">
                                    {service.category}
                                </span>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{service.name}</h1>
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    {service.description}
                                </p>
                                {service.decorationCharge && service.decorationCharge > 0 && (
                                    <div className="flex items-center gap-2 mb-4 text-sm text-gray-600 bg-gray-50 p-2 rounded w-fit">
                                        <Info size={16} />
                                        <span>Includes Decoration Charge: <strong>₹{service.decorationCharge}</strong></span>
                                    </div>
                                )}
                            </div>

                            {/* Customization Section */}
                            {service.items && service.items.length > 0 && (
                                <div className="mb-8 bg-gray-50 rounded-xl p-6 border border-gray-100">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-bold text-lg text-gray-800">Customize Your Service</h3>
                                        {savings > 0 && (
                                            <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                                                You save ₹{savings}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Uncheck items you don't need to reduce the price.
                                    </p>
                                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                        {service.items.map((item, index) => {
                                            const isRemoved = removedItems.includes(index);
                                            return (
                                                <div
                                                    key={index}
                                                    onClick={() => toggleItemRemoval(index)}
                                                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${isRemoved
                                                        ? 'bg-gray-100 border-gray-200 opacity-75'
                                                        : 'bg-white border-orange-200 shadow-sm hover:border-saffron'
                                                        }`}
                                                >
                                                    <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center transition-colors flex-shrink-0 ${isRemoved ? 'border-gray-400 bg-transparent' : 'border-saffron bg-saffron'
                                                        }`}>
                                                        {!isRemoved && <Check size={12} className="text-white" />}
                                                    </div>

                                                    {/* Item Image */}
                                                    {item.image && (
                                                        <div className="w-12 h-12 rounded overflow-hidden mr-3 flex-shrink-0 border border-gray-100">
                                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                        </div>
                                                    )}

                                                    <div className="flex-1">
                                                        <div className={`text-sm font-medium ${isRemoved ? 'line-through text-gray-500' : 'text-gray-900'}`}>{item.name}</div>
                                                        {item.price > 0 && (
                                                            <div className="text-xs text-gray-500 mt-0.5">Value: ₹{item.price}</div>
                                                        )}
                                                    </div>
                                                    <div className="text-right text-xs">
                                                        {isRemoved ? (
                                                            <span className="text-gray-500 font-medium">Removed</span>
                                                        ) : (
                                                            <span className="text-green-600 font-medium">
                                                                Save ₹{item.removePrice}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Price and Action */}
                            <div className="mt-auto pt-6 border-t border-gray-100">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Total Price</p>
                                        <div className="flex items-end gap-2">
                                            <span className="text-4xl font-bold text-saffron">₹{dynamicPrice}</span>
                                            {savings > 0 && (
                                                <span className="text-lg text-gray-400 line-through mb-1">₹{originalPrice}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Booking Details Section */}
                                <div className="bg-orange-50 rounded-xl p-6 border border-orange-100 mb-6">
                                    <h3 className="font-bold text-lg text-gray-800 mb-4">Booking Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                                            <input
                                                type="date"
                                                value={bookingDate}
                                                onChange={(e) => setBookingDate(e.target.value)}
                                                min={new Date().toISOString().split('T')[0]}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron outline-none"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                                            <input
                                                type="time"
                                                value={bookingTime}
                                                onChange={(e) => setBookingTime(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron outline-none"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Venue *</label>
                                            <input
                                                type="text"
                                                value={bookingVenue}
                                                onChange={(e) => setBookingVenue(e.target.value)}
                                                placeholder="Enter venue address"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron outline-none"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={handleAddToCart}
                                        className="flex-1 bg-saffron hover:bg-saffron-dark text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2"
                                    >
                                        <ShoppingCart size={24} />
                                        Book Now
                                    </button>
                                </div>
                                <p className="text-center text-xs text-gray-400 mt-4">
                                    * Final price may vary based on location and specific requirements.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetails;
