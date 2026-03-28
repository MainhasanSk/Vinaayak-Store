import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Palette, Sparkles, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Service {
    id: string;
    name: string;
    category: string;
    price: number;
    description: string;
    image: string;
}

const DecorationPage: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDecorations = async () => {
            try {
                const q = query(
                    collection(db, 'services'),
                    where('category', '==', 'Decoration')
                );
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Service[];
                setServices(data);
            } catch (error) {
                console.error("Error fetching decorations", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDecorations();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-20 bg-purple-50 min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-purple-50 min-h-screen">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4 flex items-center justify-center gap-4">
                        <Sparkles className="animate-pulse" size={40} /> Divine Decorations
                    </h1>
                    <p className="text-purple-100 max-w-2xl mx-auto text-lg">Transforming your sacred spaces into celestial settings. Beautiful, traditional, and elegant decors for every occasion.</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 -mt-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map(service => (
                        <div key={service.id} className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 group border border-purple-100 flex flex-col">
                            <div className="h-64 relative overflow-hidden">
                                <img
                                    src={service.image || 'https://via.placeholder.com/600x400'}
                                    alt={service.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/40 transition-all"></div>
                                <div className="absolute bottom-4 left-6">
                                    <h3 className="text-white text-2xl font-bold">{service.name}</h3>
                                </div>
                            </div>
                            <div className="p-8 flex-grow flex flex-col">
                                <div className="flex items-center gap-2 mb-4 text-purple-600 font-bold text-sm uppercase tracking-widest">
                                    <Palette size={16} />
                                    <span>Premium Service</span>
                                </div>
                                <p className="text-gray-600 mb-8 line-clamp-3 text-lg leading-relaxed flex-grow">{service.description}</p>
                                <div className="flex items-center justify-between border-t border-purple-50 pt-6">
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-bold mb-1">Starting from</p>
                                        <span className="text-3xl font-black text-indigo-700">₹{service.price}</span>
                                    </div>
                                    <Link
                                        to={`/services/${service.id}`}
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-purple-200 transition-all flex items-center gap-2 active:scale-95"
                                    >
                                        Details <ChevronRight size={18} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {services.length === 0 && (
                    <div className="text-center py-32 bg-white rounded-[40px] shadow-sm border-2 border-dashed border-purple-200">
                        <Palette size={64} className="mx-auto text-purple-200 mb-6" />
                        <h3 className="text-2xl font-bold text-gray-800">Coming Soon!</h3>
                        <p className="text-gray-500 max-w-xs mx-auto mt-2">We are curating our decoration portfolio. Stay tuned for stunning themes.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DecorationPage;
