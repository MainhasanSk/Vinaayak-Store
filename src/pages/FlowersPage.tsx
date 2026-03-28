import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Flower2 } from 'lucide-react';
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

const FlowersPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchFlowers = async () => {
            try {
                const q = query(
                    collection(db, 'products'),
                    where('category', '==', 'Fresh Flowers')
                );
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
                setProducts(data);
            } catch (error) {
                console.error("Error fetching flowers", error);
                toast.error("Failed to load flowers");
            } finally {
                setLoading(false);
            }
        };
        fetchFlowers();
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
        toast.success(`${product.name} added to cart!`);
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
            <div className="bg-gradient-to-r from-pink-500 to-rose-600 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold font-serif mb-4 flex items-center justify-center gap-3">
                        <Flower2 size={36} /> Fresh Flowers
                    </h1>
                    <p className="text-pink-100 max-w-2xl mx-auto">Vibrant, aromatic, and fresh blooms picked daily for your prayers and celebrations.</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map(product => (
                        <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-pink-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                            <div className="h-64 relative overflow-hidden">
                                <img
                                    src={product.image || 'https://via.placeholder.com/400x500'}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                                />
                                {!product.inStock && (
                                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                                        <span className="bg-gray-800 text-white text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">Out of Stock</span>
                                    </div>
                                )}
                                <div className="absolute top-3 left-3">
                                    <span className="bg-white/90 backdrop-blur-sm text-pink-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter shadow-sm border border-pink-50">
                                        Fresh Daily
                                    </span>
                                </div>
                            </div>
                            <div className="p-5">
                                <Link to={`/products/${product.id}`}>
                                    <h3 className="font-bold text-gray-900 mb-1 hover:text-rose-600 transition truncate text-lg" title={product.name}>{product.name}</h3>
                                </Link>
                                <p className="text-xs text-gray-500 line-clamp-1 mb-4 italic">{product.description}</p>
                                <div className="flex items-center justify-between border-t pt-4 border-gray-50">
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold">Price</p>
                                        <span className="text-2xl font-black text-rose-600">₹{product.price}</span>
                                    </div>
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        disabled={!product.inStock}
                                        className="bg-rose-600 hover:bg-rose-700 text-white p-3 rounded-xl shadow-lg hover:shadow-rose-200 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
                                    >
                                        <ShoppingCart size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {products.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-pink-200">
                        <Flower2 size={48} className="mx-auto text-pink-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-800">Fresh stock arriving soon!</h3>
                        <p className="text-gray-500">Check back in a few hours for the freshest selection.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FlowersPage;
