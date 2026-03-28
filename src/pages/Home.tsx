import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Flower2, PartyPopper, CalendarDays, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import heroImage from '../assets/hero-section.png';
import whyChooseUsImage from '../assets/why-choose-us.png';
import AppDownloadSection from '../components/AppDownloadSection';
import { isNativeApp } from '../utils/platform';

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
    const [dailyPujaItems, setDailyPujaItems] = useState<Product[]>([]);
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

            // Fetch Daily Puja Essentials
            const dailyPujaQuery = query(
                collection(db, 'products'),
                where('category', '==', 'Daily Puja Essential'),
                limit(4)
            );
            const dailyPujaSnapshot = await getDocs(dailyPujaQuery);
            const dailyPujaData = dailyPujaSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Product[];
            setDailyPujaItems(dailyPujaData);

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
            title: 'Daily Puja Essential',
            desc: 'Daily ritual requirements',
            link: '/daily-puja-essentials?category=Daily Puja Essential'
        },
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
            <section className={`relative flex items-center bg-orange-50 overflow-hidden ${isNativeApp() ? 'py-8' : 'min-h-[500px] md:h-[600px] py-12 md:py-0'}`}>
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between relative z-10">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        transition={{ duration: 0.8 }}
                        className={`md:w-1/2 text-center md:text-left ${isNativeApp() ? 'mb-0' : 'mb-10 md:mb-0'}`}
                    >
                        <h1 className={`${isNativeApp() ? 'text-2xl pt-4' : 'text-4xl md:text-6xl'} font-bold text-gray-900 leading-tight mb-4 font-serif`}>
                            Your One-Stop Shop for <span className="text-saffron">Divine Essentials</span>
                        </h1>
                        {!isNativeApp() && (
                            <>
                                <p className="text-lg text-gray-600 mb-8 max-w-lg">
                                    Get fresh flowers, pure puja items, and professional decoration services delivered to your doorstep.
                                </p>
                                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                    <Link to="/shop" className="bg-saffron text-white py-3 px-8 rounded-full font-bold shadow-lg hover:bg-saffron-dark transition flex items-center gap-2">
                                        Shop Now <ArrowRight size={20} />
                                    </Link>
                                    <Link to="/services" className="bg-white text-saffron border-2 border-saffron py-3 px-8 rounded-full font-bold hover:bg-orange-50 transition">
                                        Our Services
                                    </Link>
                                </div>
                            </>
                        )}
                    </motion.div>
                    {!isNativeApp() && (
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="md:w-1/2"
                        >
                            <img
                                src={heroImage}
                                alt="Divine Vinayak"
                                className="w-full h-auto drop-shadow-2xl rounded-2xl"
                            />
                        </motion.div>
                    )}
                </div>
                {!isNativeApp() && (
                    <>
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-saffron/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-saffron/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                    </>
                )}
            </section>

            {/* Wave Divider */}
            {!isNativeApp() && (
                <div className="relative h-20 -mt-20 overflow-hidden">
                    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 w-full h-20 fill-white">
                        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"></path>
                    </svg>
                </div>
            )}

            {/* Features/Categories Section */}
            <section className="py-8 md:py-12 bg-white border-y border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 min-[1600px]:grid-cols-5 gap-3 md:gap-6">
                        {features.map((feature, idx) => (
                            <Link
                                to={feature.link}
                                key={idx}
                                className="bg-white p-4 md:p-8 rounded-xl shadow-sm hover:shadow-md transition flex flex-col md:flex-row items-center md:items-center text-center md:text-left gap-3 md:gap-5 group cursor-pointer border border-transparent hover:border-saffron/20 h-full min-h-[120px] md:min-h-[100px]"
                            >
                                <div className="bg-saffron/10 p-3 md:p-4 rounded-full text-saffron group-hover:bg-saffron group-hover:text-white transition shrink-0">
                                    <feature.icon size={28} className="md:w-8 md:h-8" />
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col items-center md:items-start">
                                    <h3 className="font-bold text-gray-900 group-hover:text-saffron transition leading-tight text-sm md:text-lg whitespace-normal md:whitespace-nowrap overflow-hidden text-ellipsis">{feature.title}</h3>
                                    <p className="hidden md:block text-sm text-gray-500 mt-1 line-clamp-1">{feature.desc}</p>
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
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
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

                            {/* Daily Puja Essentials */}
                            {dailyPujaItems.length > 0 && (
                                <div>
                                    <div className="flex justify-between items-center mb-8">
                                        <div>
                                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-serif">Daily Puja Essentials</h2>
                                            <div className="w-24 h-1 bg-saffron mt-2 rounded-full"></div>
                                        </div>
                                        <Link to="/daily-puja-essentials?category=Daily Puja Essential" className="text-saffron font-semibold hover:text-saffron-dark flex items-center gap-2">
                                            View All <ArrowRight size={18} />
                                        </Link>
                                    </div>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                                        {dailyPujaItems.map((item) => (
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
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                                        {packages.map((pkg) => (
                                            <Link to={`/packages/${pkg.id}`} key={pkg.id} className="group">
                                                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
                                                    <div className="relative h-56 overflow-hidden bg-gray-100">
                                                        <img
                                                            src={pkg.image}
                                                            alt={pkg.name}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                                        />
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
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                                        {services.map((service) => (
                                            <Link to={`/services/${service.id}`} key={service.id} className="group">
                                                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
                                                    <div className="relative h-56 overflow-hidden bg-gray-100">
                                                        <img
                                                            src={service.image}
                                                            alt={service.name}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                                        />
                                                    </div>
                                                    <div className="p-4">
                                                        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-saffron transition">{service.name}</h3>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-xl font-bold text-saffron">₹{service.basePrice}</span>
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

            {/* Why Choose Us Section - Hidden only on Native App */}
            {!isNativeApp() && (
                <section className="py-20 bg-orange-50">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <div className="md:w-1/2">
                                <img
                                    src={whyChooseUsImage}
                                    alt="Why Choose Us"
                                    className="rounded-2xl shadow-xl"
                                />
                            </div>
                            <div className="md:w-1/2">
                                <h2 className="text-3xl font-bold mb-6 font-serif">Why Choose Vinayak Store?</h2>
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="bg-saffron/10 p-2 h-10 w-10 rounded-full flex items-center justify-center text-saffron">
                                            <ArrowRight size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold">Pure & Authentic</h4>
                                            <p className="text-gray-600">We source directly from trusted vendors.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="bg-saffron/10 p-2 h-10 w-10 rounded-full flex items-center justify-center text-saffron">
                                            <ArrowRight size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold">Fresh Daily</h4>
                                            <p className="text-gray-600">Our flowers are picked fresh every morning.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="bg-saffron/10 p-2 h-10 w-10 rounded-full flex items-center justify-center text-saffron">
                                            <ArrowRight size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold">Professional Service</h4>
                                            <p className="text-gray-600">Expert decorators for your special event.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}


            {!isNativeApp() && (
                <AppDownloadSection />
            )}
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
        </div >
    );
};

export default Home;
