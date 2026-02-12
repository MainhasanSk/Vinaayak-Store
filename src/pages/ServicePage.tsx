import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import toast from 'react-hot-toast';

interface Service {
    id: string;
    name: string;
    category: string;
    description: string;
    image: string;
    price: number;
    decorationCharge?: number;
}

const CATEGORIES = [
    'All',
    'Wedding Car Decoration',
    'Birthday Decoration',
    'Anniversary Decoration',
    'Anna Prashanna Decoration',
    'Other Decoration'
];

const ServicePage: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'services'));
                const servicesData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Service[];
                setServices(servicesData);
            } catch (error) {
                console.error(error);
                toast.error('Failed to load services');
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
        window.scrollTo(0, 0);
    }, []);

    const filteredServices = selectedCategory === 'All'
        ? services
        : services.filter(service => service.category === selectedCategory);

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Decoration Services</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Transform your special moments with our exquisite decoration services tailored to your unique style.
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {CATEGORIES.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === category
                                ? 'bg-saffron text-white shadow-lg scale-105'
                                : 'bg-white text-gray-600 hover:bg-gray-100 hover:shadow-md'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredServices.map(service => (
                            <div key={service.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
                                <Link to={`/services/${service.id}`} className="block relative h-64 overflow-hidden group">
                                    <img
                                        src={service.image}
                                        alt={service.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-saffron shadow-sm">
                                        ₹{service.price + (service.decorationCharge || 0)}
                                    </div>
                                </Link>

                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="mb-4">
                                        <span className="text-xs font-semibold text-saffron uppercase tracking-wider bg-orange-50 px-2 py-1 rounded">
                                            {service.category}
                                        </span>
                                    </div>

                                    <Link to={`/services/${service.id}`} className="block">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-saffron transition-colors">
                                            {service.name}
                                        </h3>
                                    </Link>

                                    <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-grow">
                                        {service.description}
                                    </p>

                                    <div className="flex gap-3 mt-auto">
                                        <Link
                                            to={`/services/${service.id}`}
                                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 rounded-lg text-sm font-semibold transition text-center"
                                        >
                                            View Details
                                        </Link>
                                        <Link
                                            to={`/services/${service.id}`}
                                            className="flex-1 bg-saffron hover:bg-saffron-dark text-white py-2.5 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2"
                                        >
                                            Book Now
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div >
    );
};

export default ServicePage;
