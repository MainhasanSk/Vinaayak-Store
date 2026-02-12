import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useCart } from '../context/CartContext';
import { ShoppingCart, ArrowLeft, Check, AlertTriangle } from 'lucide-react';
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

const ProductDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, 'products', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
                } else {
                    toast.error("Product not found");
                }
            } catch (error) {
                console.error("Error fetching product", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (product) {
            addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity,
                type: 'product'
            });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
                <Link to="/shop" className="text-saffron hover:underline">Return to Shop</Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Link to="/shop" className="inline-flex items-center text-gray-500 hover:text-saffron mb-6">
                <ArrowLeft size={18} className="mr-2" /> Back to Shop
            </Link>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Image Section */}
                    <div className="h-[400px] md:h-[600px] bg-gray-50 p-6 flex items-center justify-center">
                        <img
                            src={product.image || 'https://via.placeholder.com/600'}
                            alt={product.name}
                            className="max-h-full max-w-full object-contain rounded-lg shadow-lg hover:scale-105 transition duration-500"
                        />
                    </div>

                    {/* Info Section */}
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                        <span className="text-saffron font-bold uppercase tracking-widest text-sm mb-2">{product.category}</span>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4 font-serif">{product.name}</h1>
                        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                            {product.description}
                        </p>

                        <div className="flex items-center mb-8">
                            <span className="text-4xl font-bold text-gray-900 mr-4">₹{product.price}</span>
                            {product.inStock ? (
                                <span className="inline-flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium">
                                    <Check size={16} className="mr-1" /> In Stock
                                </span>
                            ) : (
                                <span className="inline-flex items-center text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm font-medium">
                                    <AlertTriangle size={16} className="mr-1" /> Out of Stock
                                </span>
                            )}
                        </div>

                        {product.inStock && (
                            <div className="space-y-4 max-w-sm">
                                <div className="flex items-center gap-4">
                                    <label className="text-gray-700 font-medium">Quantity:</label>
                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="px-3 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                                        >-</button>
                                        <span className="px-3 py-2 font-medium w-10 text-center">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="px-3 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                                        >+</button>
                                    </div>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    className="w-full bg-saffron hover:bg-saffron-dark text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    <ShoppingCart size={24} />
                                    Add to Cart
                                </button>
                            </div>
                        )}

                        {!product.inStock && (
                            <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-lg">
                                This item is currently unavailable. Please check back later.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
