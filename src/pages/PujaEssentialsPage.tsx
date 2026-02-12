import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Package as PackageIcon, Plus, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    description: string;
    image: string;
    inStock: boolean;
}

interface Package {
    id: string;
    name: string;
    basePrice: number;
    image: string;
    description: string;
    items: { name: string; isOptional: boolean }[];
}

const PujaEssentialsPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Products
                const productsQuery = query(collection(db, 'products'), where('category', '==', 'Pooja Essentials'));
                const productsSnapshot = await getDocs(productsQuery);
                const productsData = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];

                // Fetch Packages
                const packagesSnapshot = await getDocs(collection(db, 'packages'));
                const packagesData = packagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Package[];

                setProducts(productsData);
                setPackages(packagesData);
            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAddPackage = (pkg: Package) => {
        addToCart({
            id: pkg.id,
            name: pkg.name,
            price: pkg.basePrice,
            image: pkg.image,
            quantity: 1,
            type: 'package',
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20 bg-orange-50 min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron"></div>
            </div>
        );
    }

    return (
        <div className="bg-orange-50 min-h-screen">
            <div className="bg-gradient-to-r from-saffron to-red-600 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold font-serif mb-4">Puja Essentials & Packages</h1>
                    <p className="text-yellow-100 max-w-2xl mx-auto">Everything you need for your sacred rituals, from individual items to complete kits.</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 space-y-16">

                {/* Section 1: Complete Packages */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-red-100 p-2 rounded-full text-red-600">
                            <PackageIcon size={24} />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 font-serif">Complete Puja Packages</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {packages.map(pkg => (
                            <div key={pkg.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-red-100 hover:shadow-xl transition">
                                <div className="h-48 relative">
                                    <img src={pkg.image || 'https://via.placeholder.com/400'} alt={pkg.name} className="w-full h-full object-cover" />
                                    <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-red-800 shadow-sm">
                                        KIT
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{pkg.description}</p>

                                    <div className="bg-gray-50 p-3 rounded-lg mb-4">
                                        <p className="text-xs font-bold text-gray-500 uppercase mb-2">Includes:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {pkg.items?.slice(0, 3).map((item, i) => (
                                                <span key={i} className="text-xs bg-white border border-gray-200 px-2 py-1 rounded-md text-gray-700">
                                                    {item.name}
                                                </span>
                                            ))}
                                            {pkg.items?.length > 3 && (
                                                <span className="text-xs text-gray-500 px-2 py-1">+{pkg.items.length - 3} more</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-2xl font-bold text-gray-900">₹{pkg.basePrice}</span>
                                        <button
                                            onClick={() => handleAddPackage(pkg)}
                                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition"
                                        >
                                            <Plus size={18} /> Add Kit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section 2: Individual Essentials */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-saffron/10 p-2 rounded-full text-saffron">
                            <ShoppingCart size={24} />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 font-serif">Individual Essentials</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {products.map(product => (
                            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden hover:shadow-md transition group">
                                <div className="h-40 relative overflow-hidden">
                                    <img src={product.image || 'https://via.placeholder.com/300'} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                                    {!product.inStock && (
                                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded font-bold">Sold Out</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <Link to={`/products/${product.id}`}>
                                        <h3 className="font-bold text-gray-900 mb-1 hover:text-saffron transition truncate" title={product.name}>{product.name}</h3>
                                    </Link>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="font-bold text-gray-900">₹{product.price}</span>
                                        <button
                                            onClick={() => addToCart({
                                                id: product.id,
                                                name: product.name,
                                                price: product.price,
                                                image: product.image,
                                                quantity: 1,
                                                type: 'product'
                                            })}
                                            disabled={!product.inStock}
                                            className="bg-saffron hover:bg-saffron-dark text-white p-1.5 rounded-full transition disabled:opacity-50"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
};

export default PujaEssentialsPage;
