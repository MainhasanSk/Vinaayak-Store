import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Filter, Search } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    description: string;
    image: string;
    inStock: boolean;
}

const CATEGORIES = [
    'All',
    'Pooja Essentials',
    'Fresh Flowers',
    'Flower Bouquet',
    'Pooja Flowers',
    'Fresh Marigold Flower Garland',
    'Fresh Flower Bar Mala',
];

const Shop: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
    const [searchQuery, setSearchQuery] = useState('');
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'products'));
                const productsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Product[];
                setProducts(productsData);
            } catch (error) {
                console.error("Error fetching products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        const cat = searchParams.get('category');
        if (cat) {
            setSelectedCategory(cat);
        }
    }, [searchParams]);

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        if (category === 'All') {
            searchParams.delete('category');
        } else {
            searchParams.set('category', category);
        }
        setSearchParams(searchParams);
    };

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-gradient-to-r from-saffron to-saffron-dark text-white py-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold font-serif mb-4">Divine Collection</h1>
                    <p className="text-yellow-100 max-w-xl mx-auto">Explore our range of premium puja essentials and fresh flowers.</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar / Filters */}
                    <aside className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                            <div className="mb-6">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-saffron outline-none"
                                    />
                                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                </div>
                            </div>

                            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Filter size={18} /> Categories
                            </h3>
                            <ul className="space-y-2">
                                {CATEGORIES.map(category => (
                                    <li key={category}>
                                        <button
                                            onClick={() => handleCategoryChange(category)}
                                            className={`w-full text-left px-3 py-2 rounded-lg transition text-sm ${selectedCategory === category
                                                    ? 'bg-saffron/10 text-saffron font-bold'
                                                    : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            {category}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <main className="flex-1">
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron"></div>
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map(product => (
                                    <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden group border border-gray-100 flex flex-col">
                                        <div className="relative h-64 overflow-hidden">
                                            <img
                                                src={product.image || 'https://via.placeholder.com/300'}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                            />
                                            {!product.inStock && (
                                                <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">Out of Stock</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4 flex flex-col flex-grow">
                                            <span className="text-xs text-saffron font-semibold uppercase tracking-wider mb-1">{product.category}</span>
                                            <Link to={`/products/${product.id}`} className="block">
                                                <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-saffron transition">{product.name}</h3>
                                            </Link>
                                            <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">{product.description}</p>

                                            <div className="flex items-center justify-between mt-auto">
                                                <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
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
                                                    className="bg-gray-900 hover:bg-saffron text-white p-2 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Add to Cart"
                                                >
                                                    <ShoppingCart size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                                <p className="text-xl text-gray-500 mb-2">No products found.</p>
                                <p className="text-gray-400">Try adjusting your filters or search.</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Shop;
