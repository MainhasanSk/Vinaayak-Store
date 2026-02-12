import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, deleteField } from 'firebase/firestore';
import { Plus, Edit, Trash2, X, Package as PackageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadImageToCloudinary } from '../../lib/cloudinary';

interface ServiceItem {
    name: string;
    price: number;
    removePrice: number;
    image?: string;
    imageFile?: File; // For upload handling
}

interface Service {
    id: string;
    name: string;
    price: number;
    category: string;
    description: string;
    image: string;
    items?: ServiceItem[];
    decorationCharge?: number;
}

const SUBCATEGORIES = [
    'Wedding Car Decoration',
    'Birthday Decoration',
    'Anniversary Decoration',
    'Anna Prashanna Decoration',
    'Other Decoration'
];

const ServiceManagement: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    // Form State
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [decorationCharge, setDecorationCharge] = useState(0);
    const [category, setCategory] = useState(SUBCATEGORIES[0]);
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState('');
    const [items, setItems] = useState<ServiceItem[]>([]);

    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const querySnapshot = await getDocs(collection(db, 'services'));
            const servicesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Service[];
            setServices(servicesData);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch services');
        } finally {
            setLoading(false);
        }
    };

    const handleMigrateServices = async () => {
        if (!window.confirm('Are you sure you want to migrate all services? This will flatten the structure and remove variants. This logic assumes the first variant is the primary one.')) return;

        try {
            setLoading(true);
            const querySnapshot = await getDocs(collection(db, 'services'));
            let migratedCount = 0;

            for (const docSnapshot of querySnapshot.docs) {
                const data = docSnapshot.data() as any;

                // Check if old structure exists and hasn't been migrated yet (or needs update)
                // We assume if 'variants' exists, we should migrate.
                if (data.variants && Array.isArray(data.variants) && data.variants.length > 0) {
                    const firstVariant = data.variants[0];

                    // Prepare new data, prioritizing existing root data if it was partially updated, otherwise taking from variant
                    const updates = {
                        price: firstVariant.price,
                        items: firstVariant.items || [],
                        variants: deleteField(), // Remove the variants field to complete migration
                        decorationCharge: 0 // Initialize decoration charge
                    };

                    await updateDoc(doc(db, 'services', docSnapshot.id), updates);
                    migratedCount++;
                }
            }

            toast.success(`Migration complete! Updated ${migratedCount} services.`);
            fetchServices();
        } catch (error) {
            console.error("Migration failed:", error);
            toast.error("Migration failed. Check console.");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (service?: Service) => {
        if (service) {
            setEditingService(service);
            setName(service.name);
            setPrice(service.price || 0);
            setDecorationCharge(service.decorationCharge || 0);
            setCategory(service.category);
            setDescription(service.description);
            setImageUrl(service.image);
            setItems(service.items || []);
        } else {
            setEditingService(null);
            setName('');
            setPrice(0);
            setDecorationCharge(0);
            setCategory(SUBCATEGORIES[0]);
            setDescription('');
            setImageUrl('');
            setItems([]);
        }
        setImageFile(null);
        setIsModalOpen(true);
    };

    const handleItemChange = (index: number, field: keyof ServiceItem, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { name: '', price: 0, removePrice: 0 }]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        try {
            let finalImageUrl = imageUrl;
            if (imageFile) {
                const uploaded = await uploadImageToCloudinary(imageFile);
                if (uploaded) finalImageUrl = uploaded;
            }

            // Handle Item Image Uploads
            const processedItems = await Promise.all(items.map(async (item) => {
                let itemImageUrl = item.image;
                if (item.imageFile) {
                    const uploadedUrl = await uploadImageToCloudinary(item.imageFile);
                    if (uploadedUrl) {
                        itemImageUrl = uploadedUrl;
                    }
                }

                // Return item without the File object for Firestore
                const { imageFile, ...rest } = item;
                return {
                    ...rest,
                    image: itemImageUrl
                };
            }));

            const serviceData = {
                name,
                price: Number(price),
                decorationCharge: Number(decorationCharge),
                category,
                description,
                image: finalImageUrl,
                items: processedItems,
                updatedAt: serverTimestamp(),
            };

            if (editingService) {
                const serviceRef = doc(db, 'services', editingService.id);
                await updateDoc(serviceRef, serviceData);
                toast.success('Service updated successfully');
            } else {
                await addDoc(collection(db, 'services'), {
                    ...serviceData,
                    createdAt: serverTimestamp(),
                });
                toast.success('Service created successfully');
            }

            setIsModalOpen(false);
            fetchServices();
        } catch (error) {
            console.error(error);
            toast.error('Failed to save service');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            try {
                await deleteDoc(doc(db, 'services', id));
                toast.success('Service deleted');
                fetchServices();
            } catch (error) {
                console.error(error);
                toast.error('Failed to delete service');
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Service Management</h1>
                <div className="flex gap-4">
                    <button
                        onClick={handleMigrateServices}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                    >
                        Migrate Old Data
                    </button>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-saffron hover:bg-saffron-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                    >
                        <Plus size={20} />
                        Add Service
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map(service => (
                        <div key={service.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                            <div className="relative h-48">
                                <img
                                    src={service.image || 'https://via.placeholder.com/300'}
                                    alt={service.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <button onClick={() => handleOpenModal(service)} className="bg-white/90 p-2 rounded-full text-blue-600 hover:text-blue-800 shadow-sm">
                                        <Edit size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(service.id)} className="bg-white/90 p-2 rounded-full text-red-600 hover:text-red-800 shadow-sm">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-gray-800 shadow-sm">
                                    ₹{service.price}
                                </div>
                            </div>
                            <div className="p-4">
                                <span className="text-xs font-semibold text-saffron uppercase tracking-wider">{service.category}</span>
                                <h3 className="text-lg font-bold text-gray-900 mt-1">{service.name}</h3>
                                <p className="text-gray-500 text-sm mt-2 line-clamp-2">{service.description}</p>
                                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-600">
                                    <span className="flex items-center gap-1"><PackageIcon size={16} /> {service.items?.length || 0} Items</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-xl font-bold">{editingService ? 'Edit Service' : 'Add New Service'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Main Service Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-saffron outline-none"
                                            placeholder="e.g., Luxury Wedding Car"
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Total Price (₹)</label>
                                            <input
                                                type="number"
                                                required
                                                value={price}
                                                onChange={e => setPrice(parseFloat(e.target.value))}
                                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-saffron outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Decoration Charge (₹)</label>
                                            <input
                                                type="number"
                                                value={decorationCharge}
                                                onChange={e => setDecorationCharge(parseFloat(e.target.value))}
                                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-saffron outline-none"
                                                placeholder="Fixed charge"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                            <select
                                                value={category}
                                                onChange={e => setCategory(e.target.value)}
                                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-saffron outline-none"
                                            >
                                                {SUBCATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
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
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Main Image</label>
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
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-semibold text-gray-800">Included Items</h3>
                                        <button type="button" onClick={addItem} className="text-xs bg-white border border-gray-300 px-2 py-1 rounded hover:bg-gray-50">
                                            + Add Item
                                        </button>
                                    </div>
                                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                                        {items.map((item, index) => (
                                            <div key={index} className="flex gap-2 mb-2 items-center bg-white p-2 rounded shadow-sm border border-gray-100">
                                                <div className="w-8 h-8 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                                                    {item.image || item.imageFile ? (
                                                        <img
                                                            src={item.imageFile ? URL.createObjectURL(item.imageFile) : item.image}
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">?</div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <input
                                                        type="text"
                                                        placeholder="Item Name"
                                                        value={item.name}
                                                        onChange={e => handleItemChange(index, 'name', e.target.value)}
                                                        className="w-full px-2 py-1 text-sm border rounded"
                                                        required
                                                    />
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={e => e.target.files?.[0] && handleItemChange(index, 'imageFile', e.target.files[0])}
                                                        className="w-full text-xs text-gray-500 mt-1"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-1 w-20">
                                                    <input
                                                        type="number"
                                                        placeholder="Price"
                                                        value={item.price}
                                                        onChange={e => handleItemChange(index, 'price', parseFloat(e.target.value))}
                                                        className="w-full px-1 py-1 text-xs border rounded"
                                                        title="Actual Price"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-1 w-20">
                                                    <input
                                                        type="number"
                                                        placeholder="Saved"
                                                        value={item.removePrice}
                                                        onChange={e => handleItemChange(index, 'removePrice', parseFloat(e.target.value))}
                                                        className="w-full px-1 py-1 text-xs border rounded"
                                                        title="Saved if removed"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(index)}
                                                    className="text-red-400 hover:text-red-600 p-1"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        {items.length === 0 && (
                                            <div className="text-center text-gray-400 py-8 text-sm">
                                                No items added to this service. Add items to allow customization.
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
                                        'Save Service'
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

export default ServiceManagement;
