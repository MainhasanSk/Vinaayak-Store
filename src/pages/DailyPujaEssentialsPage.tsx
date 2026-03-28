import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useCart } from '../context/CartContext';
import { Plus, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    description: string;
    image: string;
    inStock: boolean;
}

const DailyPujaEssentialsPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const q = query(
                    collection(db, 'products'),
                    where('category', '==', 'Daily Puja Essential')
                );
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
                setProducts(data);
            } catch (error) {
                console.error("Error fetching items", error);
                toast.error("Failed to load essentials");
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, []);

    const handleAddToCart = (product: Product) => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
            type: 'product'
        });
        toast.success(`Added to cart!`);
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
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold font-serif mb-4 flex items-center justify-center gap-3">
                        <Flame size={36} /> Daily Puja Essentials
                    </h1>
                    <p className="text-orange-100 max-w-2xl mx-auto">Pure & authentic items for your daily spiritual journey. Quality you can trust for every ritual.</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {products.map(product => (
                        <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                            <div className="h-48 relative overflow-hidden bg-gray-50">
                                <img
                                    src={product.image || 'https://via.placeholder.com/300'}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                />
                                {!product.inStock && (
                                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                        <span className="bg-red-600 text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase">Out of Stock</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <Link to={`/products/${product.id}`}>
                                    <h3 className="font-bold text-gray-900 mb-1 hover:text-saffron transition truncate text-sm" title={product.name}>{product.name}</h3>
                                </Link>
                                <div className="flex items-center justify-between mt-4">
                                    <span className="font-black text-gray-900 text-lg">₹{product.price}</span>
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        disabled={!product.inStock}
                                        className="bg-saffron hover:bg-saffron-dark text-white p-2 rounded-lg shadow-md transition-transform active:scale-95 disabled:opacity-50"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {products.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl">
                        <Flame size={48} className="mx-auto text-orange-200 mb-4" />
                        <h3 className="text-xl font-bold text-gray-800">No essentials found.</h3>
                        <p className="text-gray-500">We're updating our collection daily.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DailyPujaEssentialsPage;
