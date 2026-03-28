import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useCart } from '../context/CartContext';
import { Package as PackageIcon, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface PackageItem {
    name: string;
    type: 'product' | 'custom';
    price: number;
    removePrice: number;
    isOptional: boolean;
    image?: string;
}

interface Package {
    id: string;
    name: string;
    items: PackageItem[];
    basePrice: number; // Deal Price
    totalWorth: number;
    isCustomizable: boolean;
    image: string;
    description: string;
}

const PackagesPage: React.FC = () => {
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'packages'));
                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Package[];
                setPackages(data);
            } catch (error) {
                console.error("Error fetching packages", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPackages();
    }, []);

    const handleQuickAdd = (pkg: Package) => {
        addToCart({
            id: pkg.id,
            name: pkg.name,
            price: pkg.basePrice,
            image: pkg.image,
            quantity: 1,
            type: 'package',
        });
        toast.success(`Package "${pkg.name}" added to cart!`);
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20 bg-stone-50 min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
            </div>
        );
    }

    return (
        <div className="bg-stone-50 min-h-screen">
            <div className="bg-gradient-to-tr from-red-900 via-orange-900 to-amber-900 text-white py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight font-serif uppercase">Sacred Puja Packages</h1>
                    <p className="text-amber-100 max-w-3xl mx-auto text-xl font-light italic">Expertly curated kits with 100% pure ingredients, blessed for your spiritual success.</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16 -mt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {packages.map(pkg => (
                        <div key={pkg.id} className="bg-white rounded-[2rem] shadow-2xl overflow-hidden hover:shadow-orange-100/50 transition-all duration-500 transform hover:-translate-y-2 flex flex-col group border border-stone-100">
                            <div className="h-64 relative overflow-hidden cursor-pointer" onClick={() => navigate(`/packages/${pkg.id}`)}>
                                <img
                                    src={pkg.image || 'https://via.placeholder.com/600'}
                                    alt={pkg.name}
                                    className="w-full h-full object-cover transition duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                <div className="absolute top-4 right-4 bg-amber-400 text-red-900 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase shadow-xl">
                                    SAVE ₹{(pkg.totalWorth || pkg.basePrice * 1.2) - pkg.basePrice}
                                </div>
                                <div className="absolute bottom-6 left-6 text-white uppercase tracking-tighter">
                                    <h2 className="text-3xl font-black">{pkg.name}</h2>
                                </div>
                            </div>

                            <div className="p-8 flex-1 flex flex-col">
                                <p className="text-stone-500 text-sm mb-8 flex-grow leading-relaxed italic">"{pkg.description}"</p>

                                <div className="bg-stone-50 rounded-3xl p-6 mb-8 border border-stone-100 shadow-inner">
                                    <div className="flex items-center gap-2 mb-4 text-red-800 font-black text-xs uppercase tracking-widest">
                                        <ShieldCheck size={16} /> Authenticity Guaranteed
                                    </div>
                                    <ul className="space-y-3">
                                        {pkg.items?.slice(0, 3).map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-sm text-stone-700 font-medium">
                                                <div className="mt-1 bg-green-100 rounded-full p-0.5"><Check size={12} className="text-green-600" /></div>
                                                <span className="line-clamp-1">{item.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <p className="text-[10px] text-stone-400 uppercase font-black tracking-widest mb-1">Ritual Value</p>
                                        <p className="text-sm text-stone-400 line-through font-bold">₹{pkg.totalWorth || pkg.basePrice * 1.2}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-red-800 uppercase font-black tracking-widest mb-1">Deal Price</p>
                                        <p className="text-4xl font-black text-red-900">₹{pkg.basePrice}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => navigate(`/packages/${pkg.id}`)}
                                        className="bg-stone-100 hover:bg-stone-200 text-stone-900 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                                    >
                                        Inspect
                                    </button>
                                    <button
                                        onClick={() => handleQuickAdd(pkg)}
                                        className="bg-red-800 hover:bg-red-900 text-white py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest shadow-lg shadow-red-100"
                                    >
                                        Get Kit <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {packages.length === 0 && (
                    <div className="text-center py-32 bg-white rounded-[3rem] shadow-sm border-2 border-dashed border-stone-200">
                        <PackageIcon size={64} className="mx-auto text-stone-200 mb-6" />
                        <h3 className="text-2xl font-black text-stone-800 uppercase tracking-widest">Coming Soon</h3>
                        <p className="text-stone-500 mt-2">Our scholars are curating the next set of divine kits.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PackagesPage;
