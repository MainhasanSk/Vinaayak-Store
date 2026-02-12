import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useCart } from '../context/CartContext';
import { Package as PackageIcon, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
    };

    return (
        <div className="bg-orange-50 min-h-screen">
            <div className="bg-gradient-to-r from-red-800 to-orange-900 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold font-serif mb-4">Complete Puja Packages</h1>
                    <p className="text-orange-100 max-w-2xl mx-auto">Everything you need for your rituals, curated with purity and devotion.</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {packages.map(pkg => (
                            <div key={pkg.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition duration-500 transform hover:-translate-y-2 flex flex-col group">
                                <div className="h-56 relative overflow-hidden cursor-pointer" onClick={() => navigate(`/packages/${pkg.id}`)}>
                                    <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/30 transition"></div>
                                    <img
                                        src={pkg.image || 'https://via.placeholder.com/400'}
                                        alt={pkg.name}
                                        className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute bottom-4 left-4 z-20 text-white">
                                        <div className="bg-saffron/90 px-3 py-1 rounded text-xs font-bold inline-block mb-2 shadow-sm">COMPLETE KIT</div>
                                        <h2 className="text-2xl font-bold shadow-black">{pkg.name}</h2>
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <p className="text-gray-600 text-sm mb-6 flex-grow line-clamp-2">{pkg.description}</p>

                                    <div className="flex justify-between items-end mb-4">
                                        <div>
                                            <p className="text-xs text-gray-500 line-through">Total Value: ₹{pkg.totalWorth || pkg.basePrice * 1.2}</p>
                                            <p className="text-2xl font-bold text-red-800">₹{pkg.basePrice}</p>
                                        </div>
                                    </div>

                                    <div className="bg-orange-50 rounded-xl p-4 mb-6">
                                        <div className="flex items-center gap-2 mb-3 text-saffron-dark font-bold text-sm uppercase tracking-wide">
                                            <PackageIcon size={16} /> Package Includes
                                        </div>
                                        <ul className="space-y-2 mb-2">
                                            {pkg.items?.slice(0, 4).map((item, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                                    <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                                                    <span className="line-clamp-1">{item.name}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        {pkg.items?.length > 4 && (
                                            <p className="text-xs text-gray-500 pl-6">+ {pkg.items.length - 4} more items</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => navigate(`/packages/${pkg.id}`)}
                                            className="col-span-1 bg-white border-2 border-red-800 text-red-800 hover:bg-red-50 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 text-sm"
                                        >
                                            View Details
                                        </button>
                                        <button
                                            onClick={() => handleQuickAdd(pkg)}
                                            className="col-span-1 bg-red-800 hover:bg-red-900 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 text-sm"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {/* Customization Modal Removed - Navigating to Details Page Instead */}
        </div>
    );
};

export default PackagesPage;
