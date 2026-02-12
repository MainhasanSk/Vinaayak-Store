import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadImageToCloudinary } from '../../lib/cloudinary';

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
    'Pooja Essentials',
    'Fresh Flowers',
    'Flower Bouquet',
    'Pooja Flowers',
    'Fresh Marigold Flower Garland',
    'Fresh Flower Bar Mala',
];

const ProductManagement: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Form State
    const [name, setName] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState('');
    const [inStock, setInStock] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const querySnapshot = await getDocs(collection(db, 'products'));
            const productsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Product[];
            setProducts(productsData);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            setName(product.name);
            setCategory(product.category);
            setPrice(product.price.toString());
            setDescription(product.description);
            setImageUrl(product.image);
            setInStock(product.inStock);
        } else {
            setEditingProduct(null);
            setName('');
            setCategory(CATEGORIES[0]);
            setPrice('');
            setDescription('');
            setImageUrl('');
            setInStock(true);
        }
        setImageFile(null);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        try {
            let finalImageUrl = imageUrl;

            if (imageFile) {
                const uploadedUrl = await uploadImageToCloudinary(imageFile);
                if (uploadedUrl) {
                    finalImageUrl = uploadedUrl;
                } else {
                    setUploading(false);
                    return; // Stop if upload failed
                }
            }

            const productData = {
                name,
                category,
                price: parseFloat(price),
                description,
                image: finalImageUrl,
                inStock,
                updatedAt: serverTimestamp(),
            };

            if (editingProduct) {
                await updateDoc(doc(db, 'products', editingProduct.id), productData);
                toast.success('Product updated successfully');
            } else {
                await addDoc(collection(db, 'products'), {
                    ...productData,
                    createdAt: serverTimestamp(),
                });
                toast.success('Product added successfully');
            }

            setIsModalOpen(false);
            fetchProducts();
        } catch (error) {
            console.error(error);
            toast.error('Failed to save product');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteDoc(doc(db, 'products', id));
                toast.success('Product deleted');
                fetchProducts();
            } catch (error) {
                console.error(error);
                toast.error('Failed to delete product');
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-saffron hover:bg-saffron-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                >
                    <Plus size={20} />
                    Add Product
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron"></div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-orange-50 text-gray-700">
                            <tr>
                                <th className="p-4">Image</th>
                                <th className="p-4">Name</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map(product => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="p-4">
                                        <img src={product.image || 'https://via.placeholder.com/50'} alt={product.name} className="w-12 h-12 rounded-md object-cover" />
                                    </td>
                                    <td className="p-4 font-medium text-gray-900">{product.name}</td>
                                    <td className="p-4 text-gray-600">{product.category}</td>
                                    <td className="p-4 font-bold text-saffron-dark">₹{product.price}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button onClick={() => handleOpenModal(product)} className="text-blue-500 hover:bg-blue-50 p-1 rounded">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                        No products found. Add one to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-xl font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-saffron outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        value={category}
                                        onChange={e => setCategory(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-saffron outline-none"
                                    >
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                                    <input
                                        type="number"
                                        required
                                        value={price}
                                        onChange={e => setPrice(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-saffron outline-none"
                                    />
                                </div>
                                <div className="flex items-center pt-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={inStock}
                                            onChange={e => setInStock(e.target.checked)}
                                            className="w-4 h-4 text-saffron border-gray-300 rounded focus:ring-saffron"
                                        />
                                        <span className="text-sm font-medium text-gray-700">In Stock</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-saffron outline-none"
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                                <div className="flex items-center gap-4">
                                    {imageUrl && (
                                        <img src={imageUrl} alt="Preview" className="w-20 h-20 object-cover rounded-lg border" />
                                    )}
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={e => {
                                                if (e.target.files?.[0]) {
                                                    setImageFile(e.target.files[0]);
                                                    setImageUrl(URL.createObjectURL(e.target.files[0]));
                                                }
                                            }}
                                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-saffron-dark hover:file:bg-orange-100"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Upload to update image (Cloudinary)</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="px-4 py-2 bg-saffron hover:bg-saffron-dark text-white rounded-lg transition flex items-center gap-2"
                                >
                                    {uploading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Product'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;
