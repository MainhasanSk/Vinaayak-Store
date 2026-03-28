import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useCart } from '../context/CartContext';
import { Package as PackageIcon, ArrowLeft, ShoppingCart, Info, AlertCircle, Check } from 'lucide-react';
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

const PackageDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [pkg, setPkg] = useState<Package | null>(null);
    const [loading, setLoading] = useState(true);
    const [removedItems, setRemovedItems] = useState<number[]>([]);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchPackage = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, 'packages', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setPkg({ id: docSnap.id, ...docSnap.data() } as Package);
                } else {
                    toast.error("Package not found");
                    navigate('/packages');
                }
            } catch (error) {
                console.error("Error fetching package", error);
                toast.error("Error loading package details");
            } finally {
                setLoading(false);
            }
        };
        fetchPackage();
    }, [id, navigate]);

    const toggleItemRemoval = (index: number) => {
        if (removedItems.includes(index)) {
            setRemovedItems(removedItems.filter(i => i !== index));
        } else {
            setRemovedItems([...removedItems, index]);
        }
    };

    const calculateDynamicPrice = () => {
        if (!pkg) return 0;
        let price = pkg.basePrice;
        removedItems.forEach(index => {
            const item = pkg.items[index];
            if (item) {
                price -= (item.removePrice || 0);
            }
        });
        return Math.max(0, price);
    };

    const handleAddToCart = () => {
        if (!pkg) return;
        const finalPrice = calculateDynamicPrice();
        const removedNames = removedItems.map(i => pkg.items[i].name);

        addToCart({
            id: pkg.id,
            name: pkg.name,
            price: finalPrice,
            image: pkg.image,
            quantity: 1,
            type: 'package',
            variant: `custom-${removedItems.join('-')}`,
            customization: removedNames.length > 0 ? removedNames : undefined
        });

        toast.success("Added to cart!");
        navigate('/cart');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-orange-50 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800"></div>
            </div>
        );
    }

    if (!pkg) return null;

    const currentPrice = calculateDynamicPrice();
    const savings = pkg.basePrice - currentPrice;

    return (
        <div className="bg-orange-50 min-h-screen py-12">
            <div className="container mx-auto px-4">
                <button
                    onClick={() => navigate('/packages')}
                    className="flex items-center gap-2 text-gray-600 hover:text-red-800 mb-6 transition"
                >
                    <ArrowLeft size={20} /> Back to Packages
                </button>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Left Column: Image and Description */}
                        <div className="p-8 border-r border-orange-100">
                            <div className="aspect-video rounded-xl overflow-hidden mb-8 shadow-lg relative cursor-pointer group">
                                <img
                                    src={pkg.image || 'https://via.placeholder.com/600'}
                                    alt={pkg.name}
                                    className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition"></div>
                            </div>

                            <h1 className="text-3xl font-bold font-serif text-gray-900 mb-4">{pkg.name}</h1>
                            <p className="text-gray-600 leading-relaxed mb-6">{pkg.description}</p>

                            <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
                                <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                                    <Info size={18} className="text-saffron" /> Why this package?
                                </h3>
                                <p className="text-sm text-gray-700 mb-4">
                                    Our packages are carefully curated by priests to ensure you have every essential item for your puja.
                                    We use only premium quality, pure ingredients.
                                </p>
                                <div className="flex items-center gap-4 text-sm font-medium text-red-800">
                                    <span className="flex items-center gap-1"><Check size={16} /> 100% Pure</span>
                                    <span className="flex items-center gap-1"><Check size={16} /> Verified by Priests</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Customization and Price */}
                        <div className="p-8 bg-gray-50/50">
                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <PackageIcon className="text-saffron" /> Customize Your Package
                                </h2>
                                <p className="text-sm text-gray-500 mb-4 bg-white p-3 rounded-lg border border-gray-200 flex items-start gap-2">
                                    <AlertCircle size={16} className="text-saffron mt-0.5 flex-shrink-0" />
                                    <span>
                                        Uncheck items you already have at home to remove them from the package and save money.
                                    </span>
                                </p>

                                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                    {pkg.items.map((item, idx) => {
                                        const isRemoved = removedItems.includes(idx);
                                        return (
                                            <div
                                                key={idx}
                                                className={`flex items-center p-4 rounded-xl border transition-all duration-300 ${isRemoved
                                                    ? 'bg-gray-100/80 border-gray-200 opacity-60'
                                                    : 'bg-white border-orange-100 shadow-sm hover:shadow-md hover:border-saffron/30'
                                                    }`}
                                            >
                                                {/* Checkbox / Status Indicator */}
                                                <div className="mr-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={!isRemoved}
                                                        onChange={() => toggleItemRemoval(idx)}
                                                        className="w-5 h-5 text-saffron rounded border-gray-300 focus:ring-saffron cursor-pointer"
                                                    />
                                                </div>

                                                {/* Item Image (if available) */}
                                                {item.image && (
                                                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover mr-4 border border-gray-100" />
                                                )}

                                                {/* Item Details */}
                                                <div className="flex-1">
                                                    <h4 className={`font-medium ${isRemoved ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{item.name}</h4>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.type}</span>
                                                        <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">₹{item.price}</span>
                                                    </div>
                                                </div>

                                                {/* Price / Savings Info */}
                                                <div className="text-right">
                                                    {isRemoved ? (
                                                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                                            Saved ₹{item.removePrice}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-gray-400" title="Amount saved if removed">
                                                            - ₹{item.removePrice} if removed
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Sticky Price Summary Footer for Mobile/Desktop */}
                            <div className="sticky bottom-0 bg-white p-6 rounded-xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] border border-gray-100">
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-gray-500 text-sm">
                                        <span>Items Worth (Total)</span>
                                        <span className="line-through">₹{pkg.totalWorth}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Deal Price</span>
                                        <span>₹{pkg.basePrice}</span>
                                    </div>
                                    {removedItems.length > 0 && (
                                        <div className="flex justify-between text-green-600 font-medium bg-green-50 p-2 rounded-lg">
                                            <span>Your Savings</span>
                                            <span>- ₹{savings}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="border-t pt-4 mb-6 flex justify-between items-end">
                                    <div>
                                        <p className="text-sm text-gray-500">Final Price</p>
                                        <p className="text-3xl font-bold text-red-800">₹{currentPrice}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    className="w-full bg-red-800 hover:bg-red-900 text-white py-4 rounded-xl font-bold shadow-lg transition transform active:scale-95 flex items-center justify-center gap-2 text-lg"
                                >
                                    <ShoppingCart size={20} /> Add Customized Package
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PackageDetails;
