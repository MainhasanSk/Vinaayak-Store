import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Plus, Edit, Trash2, X, Package as PackageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadImageToCloudinary } from '../../lib/cloudinary';

interface PackageItem {
    name: string;
    type: 'product' | 'custom';
    productId?: string;
    image?: string;
    price: number;
    removePrice: number;
    isOptional: boolean;
}

interface Package {
    id: string;
    name: string;
    items: PackageItem[];
    basePrice: number; // This will now act as the "Deal Price"
    totalWorth: number; // Sum of all item prices
    isCustomizable: boolean;
    image: string;
    description: string;
}

const PackageManagement: React.FC = () => {
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState<Package | null>(null);

    // Form State
    const [name, setName] = useState('');
    const [basePrice, setBasePrice] = useState(''); // Deal Price
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState('');
    const [isCustomizable, setIsCustomizable] = useState(true);

    // Items State
    const [items, setItems] = useState<PackageItem[]>([]);
    const [uploading, setUploading] = useState(false);

    // Available Products for selection
    const [availableProducts, setAvailableProducts] = useState<{ id: string; name: string; price: number; image: string }[]>([]);

    useEffect(() => {
        fetchPackages();
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'products'));
            const products = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: data.name,
                    price: data.price,
                    image: data.image
                };
            });
            setAvailableProducts(products);
        } catch (error) {
            console.error("Error fetching products", error);
        }
    };

    const fetchPackages = async () => {
        try {
            setLoading(true);
            const querySnapshot = await getDocs(collection(db, 'packages'));
            const packagesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Package[];
            setPackages(packagesData);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch packages');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (pkg?: Package) => {
        if (pkg) {
            setEditingPackage(pkg);
            setName(pkg.name);
            setBasePrice(pkg.basePrice.toString());
            setDescription(pkg.description);
            setImageUrl(pkg.image);
            setIsCustomizable(pkg.isCustomizable);
            setItems(pkg.items || []);
        } else {
            setEditingPackage(null);
            setName('');
            setBasePrice('');
            setDescription('');
            setImageUrl('');
            setIsCustomizable(true);
            setItems([]);
        }
        setImageFile(null);
        setIsModalOpen(true);
    };

    const addItem = () => {
        setItems([...items, { name: '', type: 'custom', price: 0, removePrice: 0, isOptional: false }]);
    };

    const handleItemChange = (index: number, field: keyof PackageItem, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const removeItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
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
                    return;
                }
            }

            const totalWorth = items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

            // Sanitize items to ensure no undefined values are passed to Firestore
            const sanitizedItems = items.map(item => ({
                name: item.name || '',
                type: item.type || 'custom',
                productId: item.productId || null,
                image: item.image || null,
                price: Number(item.price) || 0,
                removePrice: Number(item.removePrice) || 0,
                isOptional: !!item.isOptional
            }));

            const packageData = {
                name: name || '',
                basePrice: parseFloat(basePrice) || 0,
                totalWorth,
                description: description || '',
                image: finalImageUrl || '',
                isCustomizable: !!isCustomizable,
                items: sanitizedItems,
                updatedAt: serverTimestamp(),
            };

            if (editingPackage) {
                await updateDoc(doc(db, 'packages', editingPackage.id), packageData);
                toast.success('Package updated successfully');
            } else {
                await addDoc(collection(db, 'packages'), {
                    ...packageData,
                    createdAt: serverTimestamp(),
                });
                toast.success('Package created successfully');
            }

            setIsModalOpen(false);
            fetchPackages();
        } catch (error) {
            console.error(error);
            toast.error('Failed to save package');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this package?')) {
            try {
                await deleteDoc(doc(db, 'packages', id));
                toast.success('Package deleted');
                fetchPackages();
            } catch (error) {
                console.error(error);
                toast.error('Failed to delete package');
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Package Management</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-saffron hover:bg-saffron-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                >
                    <Plus size={20} />
                    Create Package
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {packages.map(pkg => (
                        <div key={pkg.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                            <div className="relative h-48">
                                <img
                                    src={pkg.image || 'https://via.placeholder.com/300'}
                                    alt={pkg.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <button onClick={() => handleOpenModal(pkg)} className="bg-white/90 p-2 rounded-full text-blue-600 hover:text-blue-800 shadow-sm">
                                        <Edit size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(pkg.id)} className="bg-white/90 p-2 rounded-full text-red-600 hover:text-red-800 shadow-sm">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                {pkg.isCustomizable && (
                                    <span className="absolute bottom-2 left-2 bg-saffron-dark text-white text-xs px-2 py-1 rounded">Customizable</span>
                                )}
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-bold text-gray-900">{pkg.name}</h3>
                                    <span className="font-bold text-saffron-dark">₹{pkg.basePrice}</span>
                                </div>

                                <p className="text-gray-500 text-sm mt-2 line-clamp-2">{pkg.description}</p>

                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">Included Items ({pkg.items?.length || 0})</p>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        {pkg.items?.slice(0, 3).map((item, idx) => (
                                            <li key={idx} className="flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-saffron"></span>
                                                {item.name}
                                            </li>
                                        ))}
                                        {pkg.items?.length > 3 && <li className="text-xs text-gray-400 pl-3">+ {pkg.items.length - 3} more items</li>}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-xl font-bold">{editingPackage ? 'Edit Package' : 'Create New Package'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Main Package Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Package Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-saffron outline-none"
                                            placeholder="e.g., Ganesh Puja Kit"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Deal Price (₹)</label>
                                        <input
                                            type="number"
                                            required
                                            value={basePrice}
                                            onChange={e => setBasePrice(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-saffron outline-none"
                                        />
                                        <div className="text-xs text-gray-500 mt-1">
                                            Total Worth: ₹{items.reduce((sum, item) => sum + (Number(item.price) || 0), 0)}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-2 cursor-pointer mt-2">
                                            <input
                                                type="checkbox"
                                                checked={isCustomizable}
                                                onChange={e => setIsCustomizable(e.target.checked)}
                                                className="w-4 h-4 text-saffron border-gray-300 rounded focus:ring-saffron"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Allow Customization</span>
                                        </label>
                                        <p className="text-xs text-gray-500 mt-1 pl-6">If checked, users can remove optional items.</p>
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
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Package Image</label>
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
                                        {imageUrl && <img src={imageUrl} alt="Preview" className="mt-2 h-20 rounded-md" />}
                                    </div>
                                </div>

                                {/* Items Section */}
                                <div className="bg-gray-50 p-4 rounded-xl flex flex-col h-full">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-semibold text-gray-800">Package Items</h3>
                                        <button type="button" onClick={addItem} className="text-xs bg-white border border-gray-300 px-2 py-1 rounded hover:bg-gray-50">
                                            + Add Item
                                        </button>
                                    </div>
                                    <div className="space-y-2 overflow-y-auto flex-1 max-h-[400px] pr-2">
                                        {items.map((item, index) => (
                                            <div key={index} className="bg-white p-3 rounded border border-gray-200">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-xs font-bold text-gray-500 uppercase">{item.type || 'custom'} Item</span>
                                                    <button type="button" onClick={() => removeItem(index)} className="text-gray-400 hover:text-red-500">
                                                        <X size={16} />
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                                                    <div className="flex-1 flex flex-col gap-1">
                                                        <label className="text-xs text-gray-500">Item Name</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Item Name"
                                                            value={item.name}
                                                            onChange={e => handleItemChange(index, 'name', e.target.value)}
                                                            className="w-full px-2 py-1 text-sm border-b focus:border-saffron focus:outline-none"
                                                            required
                                                        />
                                                        <select
                                                            onChange={(e) => {
                                                                const prodId = e.target.value;
                                                                if (prodId) {
                                                                    const prod = availableProducts.find(p => p.id === prodId);
                                                                    if (prod) {
                                                                        const newItems = [...items];
                                                                        newItems[index] = {
                                                                            ...newItems[index],
                                                                            name: prod.name,
                                                                            type: 'product',
                                                                            productId: prod.id,
                                                                            price: prod.price,
                                                                            removePrice: prod.price,
                                                                            image: prod.image
                                                                        };
                                                                        setItems(newItems);
                                                                    }
                                                                    e.target.value = "";
                                                                }
                                                            }}
                                                            className="text-xs text-gray-500 bg-transparent border-none focus:ring-0 cursor-pointer hover:text-saffron p-0"
                                                        >
                                                            <option value="">+ Select from Products</option>
                                                            {availableProducts.map(prod => (
                                                                <option key={prod.id} value={prod.id}>{prod.name} (₹{prod.price})</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <div className="flex-1">
                                                            <label className="text-xs text-gray-500 block">Price (₹)</label>
                                                            <input
                                                                type="number"
                                                                value={item.price}
                                                                onChange={e => handleItemChange(index, 'price', parseFloat(e.target.value))}
                                                                className="w-full px-2 py-1 text-sm border-b focus:border-saffron focus:outline-none"
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <label className="text-xs text-gray-500 block" title="Amount deducted if removed">Remove Deduct (₹)</label>
                                                            <input
                                                                type="number"
                                                                value={item.removePrice}
                                                                onChange={e => handleItemChange(index, 'removePrice', parseFloat(e.target.value))}
                                                                className="w-full px-2 py-1 text-sm border-b focus:border-saffron focus:outline-none text-red-600"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 mt-2">
                                                    <label className="flex items-center gap-1 cursor-pointer" title="Is Optional?">
                                                        <input
                                                            type="checkbox"
                                                            checked={item.isOptional}
                                                            onChange={e => handleItemChange(index, 'isOptional', e.target.checked)}
                                                            className="rounded text-saffron focus:ring-saffron"
                                                        />
                                                        <span className="text-xs text-gray-500">User Optional?</span>
                                                    </label>
                                                    {item.image && (
                                                        <span className="text-xs text-green-600 ml-auto flex items-center gap-1">
                                                            ✓ Image Set
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        {items.length === 0 && (
                                            <div className="text-center text-gray-400 py-8 text-sm">
                                                No items added. Add items included in this puja package.
                                            </div>
                                        )}
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
                                        'Save Package'
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

export default PackageManagement;
