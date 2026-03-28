import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Calendar, Star, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Service {
    id: string;
    name: string;
    category: string;
    price: number;
    description: string;
    image: string;
}

const EventManagementPage: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const q = query(
                    collection(db, 'services'),
                    where('category', '==', 'Event Management')
                );
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Service[];
                setServices(data);
            } catch (error) {
                console.error("Error fetching events", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-20 bg-blue-50 min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-blue-50 min-h-screen">
            <div className="bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 text-white py-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-10">
                    <Calendar size={300} />
                </div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Professional Event Management</h1>
                    <p className="text-blue-100 max-w-3xl mx-auto text-xl font-light leading-relaxed">From sacred Upanayans to grand Weddings, we handle every detail with precision and devotion. Your joy, our commitment.</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {services.map(service => (
                        <div key={service.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row border border-blue-100 hover:border-blue-400 transition-colors duration-500">
                            <div className="md:w-1/2 h-64 md:h-auto">
                                <img
                                    src={service.image || 'https://via.placeholder.com/500'}
                                    alt={service.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="md:w-1/2 p-10 flex flex-col">
                                <div className="bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-xs font-black uppercase w-fit mb-6 flex items-center gap-2">
                                    <Star size={12} fill="currentColor" /> Signature Experience
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-4">{service.name}</h3>
                                <p className="text-gray-500 mb-8 flex-grow leading-relaxed">{service.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-black text-blue-700">Starting ₹{service.price}</span>
                                    <Link
                                        to={`/services/${service.id}`}
                                        className="bg-gray-900 hover:bg-blue-700 text-white p-4 rounded-2xl transition-all shadow-xl hover:shadow-blue-200 active:scale-90"
                                    >
                                        <Send size={20} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {services.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-blue-100">
                        <Calendar size={60} className="mx-auto text-blue-100 mb-4" />
                        <h3 className="text-2xl font-bold text-gray-800">No events found.</h3>
                        <p className="text-gray-500">Contact us for custom event planning.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventManagementPage;
