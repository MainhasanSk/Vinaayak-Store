import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Star, Shield, Zap, Search } from 'lucide-react';
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
    const [searchQuery, setSearchQuery] = useState('');

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

    const filteredServices = services.filter(service => {
        const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
        const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Artistic Header */}
            <div className="relative bg-indigo-950 text-white pt-32 pb-48 overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full blur-[100px] opacity-20"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-[100px] opacity-20"></div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight font-serif italic italic text-transparent bg-clip-text bg-gradient-to-r from-indigo-100 to-white">
                        Master Decorations
                    </h1>
                    <p className="text-xl md:text-2xl text-indigo-200 max-w-3xl mx-auto font-light leading-relaxed">
                        Curating unforgettable atmospheres for your most precious milestones.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-32 relative z-20">
                {/* Search & Filter Bar */}
                <div className="bg-white rounded-[2.5rem] shadow-2xl p-4 mb-16 border border-slate-100 flex flex-col md:flex-row gap-4 items-center max-w-5xl mx-auto">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Find a theme..."
                            className="w-full pl-16 pr-6 py-4 rounded-3xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-200 outline-none text-slate-700 font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
                        {CATEGORIES.slice(0, 4).map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${selectedCategory === cat
                                    ? 'bg-indigo-600 text-white shadow-lg'
                                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {filteredServices.map(service => (
                        <div key={service.id} className="bg-white rounded-[3rem] overflow-hidden shadow-xl border border-slate-100 hover:shadow-2xl transition-all duration-700 flex flex-col group">
                            <Link to={`/services/${service.id}`} className="block h-80 relative overflow-hidden">
                                <img
                                    src={service.image}
                                    alt={service.name}
                                    className="w-full h-full object-cover group-hover:scale-125 transition duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl text-lg font-black text-indigo-700 shadow-xl border border-white/50">
                                    ₹{service.price + (service.decorationCharge || 0)}
                                </div>
                            </Link>

                            <div className="p-10 flex flex-col flex-grow">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600"><Star size={16} fill="currentColor" /></div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                        {service.category}
                                    </span>
                                </div>

                                <Link to={`/services/${service.id}`} className="block">
                                    <h3 className="text-3xl font-bold text-slate-900 mb-4 hover:text-indigo-600 transition-colors leading-tight">
                                        {service.name}
                                    </h3>
                                </Link>

                                <p className="text-slate-500 leading-relaxed mb-8 line-clamp-2 text-sm">
                                    {service.description}
                                </p>

                                <div className="grid grid-cols-2 gap-4 mt-auto">
                                    <Link
                                        to={`/services/${service.id}`}
                                        className="bg-slate-100 hover:bg-slate-200 text-slate-900 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center transition-colors"
                                    >
                                        Details
                                    </Link>
                                    <Link
                                        to={`/services/${service.id}`}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                                    >
                                        Book <Zap size={14} fill="currentColor" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredServices.length === 0 && (
                    <div className="text-center py-40">
                        <Shield size={64} className="mx-auto text-slate-200 mb-6" />
                        <h2 className="text-3xl font-black text-slate-900 mb-2 italic">Nothing matches your search.</h2>
                        <p className="text-slate-400">Try searching for something else or browse categories.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServicePage;
