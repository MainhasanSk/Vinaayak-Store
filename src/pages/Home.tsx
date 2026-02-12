import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Flower2, PartyPopper, CalendarDays, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import heroImage from '../assets/Hero-section.png';
import whyChooseUsImage from '../assets/why-choose-us.png';

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
}

interface Service {
    id: string;
    name: string;
    basePrice: number;
    image: string;
}

interface Package {
    id: string;
    name: string;
    price: number;
    image: string;
}

const Home: React.FC = () => {
    const [flowers, setFlowers] = useState<Product[]>([]);
    const [pujaItems, setPujaItems] = useState<Product[]>([]);
    const [packages, setPackages] = useState<Package[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeaturedItems();
    }, []);

    const fetchFeaturedItems = async () => {
        try {
            // Fetch Fresh Flowers
            const flowersQuery = query(
                collection(db, 'products'),
                where('category', '==', 'Fresh Flowers'),
                limit(4)
            );
            const flowersSnapshot = await getDocs(flowersQuery);
            const flowersData = flowersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Product[];
            setFlowers(flowersData);

            // Fetch Puja Essentials
            const pujaQuery = query(
                collection(db, 'products'),
                where('category', '==', 'Pooja Essentials'),
                limit(4)
            );
            const pujaSnapshot = await getDocs(pujaQuery);
            const pujaData = pujaSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Product[];
            setPujaItems(pujaData);

            // Fetch Packages
            const packagesQuery = query(
                collection(db, 'packages'),
                limit(4)
            );
            const packagesSnapshot = await getDocs(packagesQuery);
            const packagesData = packagesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Package[];
            setPackages(packagesData);

            // Fetch Services
            const servicesQuery = query(
                collection(db, 'services'),
                limit(4)
            );
            const servicesSnapshot = await getDocs(servicesQuery);
            const servicesData = servicesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Service[];
            setServices(servicesData);

        } catch (error) {
            console.error('Error fetching featured items:', error);
        } finally {
            setLoading(false);
        }
    };

    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const features = [
        {
            icon: Flame,
            title: 'Puja Essential',
            desc: 'Pure & authentic samagri',
            link: '/puja-essentials'
        },
        {
            icon: Flower2,
            title: 'Flowers',
            desc: 'Fresh blooms for worship',
            link: '/flowers?category=Fresh Flowers'
        },
        {
            icon: PartyPopper,
            title: 'Decoration',
            desc: 'Elegant festive service',
            link: '/decoration?category=Decoration'
        },
        {
            icon: CalendarDays,
            title: 'Event Management',
            desc: 'Seamless event planning',
            link: '/event-management?category=Event Management'
        },
    ];

    return (
        <div className="font-sans">
            {/* Hero Section */}
            <section className="relative h-[600px] bg-gradient-to-r from-orange-100 to-yellow-50 overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/mandala-pattern.png')]"></div>

                <div className="container mx-auto px-4 h-full flex flex-col md:flex-row items-center justify-between relative z-10">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        transition={{ duration: 0.6 }}
                        className="md:w-1/2 text-center md:text-left pt-12 md:pt-0"
                    >
                        <span className="inline-block px-4 py-1 rounded-full bg-saffron/10 text-saffron-dark font-bold text-sm mb-4 border border-saffron/20">
                            ✨ One Stop for Devotion
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6 font-serif">
                            Everything You Need for a <span className="text-saffron">Divine</span> Celebration
                        </h1>
                        <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto md:mx-0">
                            From fresh marigolds to complete Puja kits, and beautiful decorations for your special occasions. We bring tradition to your doorstep.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <Link to="/shop" className="bg-saffron hover:bg-saffron-dark text-white text-lg font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 flex items-center justify-center gap-2">
                                Shop Now <ArrowRight size={20} />
                            </Link>
                            <Link to="/services" className="bg-white text-saffron-dark border-2 border-saffron text-lg font-bold py-3 px-8 rounded-full shadow-sm hover:shadow-md transition hover:bg-orange-50">
                                Book Decoration
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="md:w-1/2 mt-12 md:mt-0 justify-center hidden md:flex"
                    >
                        <div className="relative w-80 h-80 md:w-[500px] md:h-[500px]">
                            {/* Decorative blob */}
                            <div className="absolute top-0 right-0 w-full h-full bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                            <div className="absolute -bottom-8 -left-8 w-full h-full bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

                            <img
                                src={heroImage}
                                alt="Festive Celebration"
                                className="relative z-10 w-full h-full object-cover rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Wave Divider */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
                    <svg className="relative block w-full h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-orange-50"></path>
                    </svg>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-12 bg-orange-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, idx) => (
                            <Link to={feature.link} key={idx} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition flex items-center gap-4 group cursor-pointer border border-transparent hover:border-saffron/20">
                                <div className="bg-saffron/10 p-3 rounded-full text-saffron group-hover:bg-saffron group-hover:text-white transition">
                                    <feature.icon size={28} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 group-hover:text-saffron transition">{feature.title}</h3>
                                    <p className="text-sm text-gray-500">{feature.desc}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron"></div>
                        </div>
                    ) : (
                        <div className="space-y-16">
                            {/* Fresh Flowers */}
                            {flowers.length > 0 && (
                                <div>
                                    <div className="flex justify-between items-center mb-8">
                                        <div>
                                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-serif">Fresh Flowers</h2>
                                            <div className="w-24 h-1 bg-saffron mt-2 rounded-full"></div>
                                        </div>
                                        <Link to="/flowers" className="text-saffron font-semibold hover:text-saffron-dark flex items-center gap-2">
                                            View All <ArrowRight size={18} />
                                        </Link>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                        {flowers.map((flower) => (
                                            <Link to={`/products/${flower.id}`} key={flower.id} className="group">
                                                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
                                                    <div className="relative h-56 overflow-hidden bg-gray-100">
                                                        <img
                                                            src={flower.image}
                                                            alt={flower.name}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                                        />
                                                    </div>
                                                    <div className="p-4">
                                                        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-saffron transition">{flower.name}</h3>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-xl font-bold text-saffron">₹{flower.price}</span>
                                                            <div className="bg-saffron/10 p-2 rounded-full text-saffron group-hover:bg-saffron group-hover:text-white transition">
                                                                <ShoppingCart size={18} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Puja Essentials */}
                            {pujaItems.length > 0 && (
                                <div>
                                    <div className="flex justify-between items-center mb-8">
                                        <div>
                                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-serif">Puja Essentials</h2>
                                            <div className="w-24 h-1 bg-saffron mt-2 rounded-full"></div>
                                        </div>
                                        <Link to="/puja-essentials" className="text-saffron font-semibold hover:text-saffron-dark flex items-center gap-2">
                                            View All <ArrowRight size={18} />
                                        </Link>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                        {pujaItems.map((item) => (
                                            <Link to={`/products/${item.id}`} key={item.id} className="group">
                                                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
                                                    <div className="relative h-56 overflow-hidden bg-gray-100">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                                        />
                                                    </div>
                                                    <div className="p-4">
                                                        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-saffron transition">{item.name}</h3>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-xl font-bold text-saffron">₹{item.price}</span>
                                                            <div className="bg-saffron/10 p-2 rounded-full text-saffron group-hover:bg-saffron group-hover:text-white transition">
                                                                <ShoppingCart size={18} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Puja Packages */}
                            {packages.length > 0 && (
                                <div>
                                    <div className="flex justify-between items-center mb-8">
                                        <div>
                                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-serif">Puja Packages</h2>
                                            <div className="w-24 h-1 bg-saffron mt-2 rounded-full"></div>
                                        </div>
                                        <Link to="/packages" className="text-saffron font-semibold hover:text-saffron-dark flex items-center gap-2">
                                            View All <ArrowRight size={18} />
                                        </Link>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                        {packages.map((pkg) => (
                                            <Link to={`/packages/${pkg.id}`} key={pkg.id} className="group">
                                                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
                                                    <div className="relative h-56 overflow-hidden bg-gray-100">
                                                        <img
                                                            src={pkg.image}
                                                            alt={pkg.name}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                                        />
                                                        <div className="absolute top-3 right-3 bg-saffron text-white px-3 py-1 rounded-full text-xs font-bold">
                                                            PACKAGE
                                                        </div>
                                                    </div>
                                                    <div className="p-4">
                                                        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-saffron transition">{pkg.name}</h3>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-xl font-bold text-saffron">₹{pkg.price}</span>
                                                            <div className="bg-saffron/10 p-2 rounded-full text-saffron group-hover:bg-saffron group-hover:text-white transition">
                                                                <ShoppingCart size={18} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Services */}
                            {services.length > 0 && (
                                <div>
                                    <div className="flex justify-between items-center mb-8">
                                        <div>
                                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-serif">Our Services</h2>
                                            <div className="w-24 h-1 bg-saffron mt-2 rounded-full"></div>
                                        </div>
                                        <Link to="/services" className="text-saffron font-semibold hover:text-saffron-dark flex items-center gap-2">
                                            View All <ArrowRight size={18} />
                                        </Link>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                        {services.map((service) => (
                                            <Link to={`/services/${service.id}`} key={service.id} className="group">
                                                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
                                                    <div className="relative h-56 overflow-hidden bg-gray-100">
                                                        <img
                                                            src={service.image}
                                                            alt={service.name}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                                        />
                                                        <div className="absolute top-3 right-3 bg-saffron text-white px-3 py-1 rounded-full text-xs font-bold">
                                                            SERVICE
                                                        </div>
                                                    </div>
                                                    <div className="p-4">
                                                        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-saffron transition">{service.name}</h3>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-xl font-bold text-saffron">From ₹{service.basePrice}</span>
                                                            <div className="bg-saffron/10 p-2 rounded-full text-saffron group-hover:bg-saffron group-hover:text-white transition">
                                                                <ArrowRight size={18} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Why Choose Us / Trust Section */}
            <section className="py-20 bg-gradient-to-br from-red-50 to-orange-100">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
                    <div className="md:w-1/2">
                        <img
                            src={whyChooseUsImage}
                            alt="Quality Trust"
                            className="rounded-3xl shadow-2xl"
                        />
                    </div>
                    <div className="md:w-1/2">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-serif mb-6">Why Vinayak Store?</h2>
                        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                            At Vinayak Store, we understand the sanctity of your rituals and celebrations. That's why we source only the freshest flowers and finest puja ingredients. Our decoration services are crafted to add elegance and grace to your special moments.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "Freshness Guaranteed on Flowers",
                                "Authentic & Pure Puja Samagri",
                                "Customizable Decoration Packages",
                                "Timely Services for Auspicious Timings"
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm">
                                    <Flame className="text-saffron fill-current" size={20} />
                                    <span className="font-semibold text-gray-800">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-20 bg-saffron-dark text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold font-serif mb-6">Ready to make your occasion special?</h2>
                    <p className="text-xl text-yellow-100 mb-8 max-w-2xl mx-auto">Book our premium decoration services or order puja essentials today.</p>
                    <div className="flex justify-center gap-4">
                        <Link to="/contact" className="bg-white text-saffron-dark font-bold py-3 px-8 rounded-full shadow-lg hover:bg-yellow-50 transition">
                            Contact Us
                        </Link>
                        <Link to="/shop" className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white/10 transition">
                            Browse Store
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
