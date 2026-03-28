import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Download, Star, Zap, ShieldCheck } from 'lucide-react';
import appMockup from '../assets/app-mockup.png';

const AppDownloadSection: React.FC = () => {
    return (
        <section className="py-24 relative overflow-hidden bg-white">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-saffron/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-100/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="premium-gradient rounded-[3rem] p-8 md:p-16 shadow-2xl overflow-hidden relative group">
                    {/* Mandala Background Pattern */}
                    <div className="mandala-bg group-hover:opacity-20 transition-opacity duration-700"></div>

                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        {/* Content Column */}
                        <div className="lg:w-3/5 text-center lg:text-left">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-bold mb-8 border border-white/30">
                                    <Star size={16} className="fill-yellow-300 text-yellow-300" />
                                    <span>Top Rated Puja App</span>
                                </div>

                                <h2 className="text-4xl md:text-6xl font-bold mb-6 font-serif leading-tight text-white">
                                    Experience the Divine <br />
                                    <span className="text-yellow-300">On Your Fingertips</span>
                                </h2>

                                <p className="text-lg md:text-xl text-orange-50 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                                    Order fresh flowers, pure puja samagri, and premium decoration services with just one tap. Download now and get exclusive app-only benefits.
                                </p>

                                {/* Feature Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                                    {[
                                        { icon: Zap, text: "Instant Muhurat Delivery" },
                                        { icon: ShieldCheck, text: "100% Pure & Authentic" },
                                        { icon: Download, text: "Easy One-Tap Reordering" },
                                        { icon: Smartphone, text: "Real-time Order Tracking" }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
                                            <div className="bg-yellow-400 text-saffron-dark p-2 rounded-xl">
                                                <item.icon size={20} />
                                            </div>
                                            <span className="font-bold text-white text-sm md:text-base">{item.text}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Download Button */}
                                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                                    <a
                                        href="/app-release.apk"
                                        download
                                        className="bg-white text-gray-900 px-10 py-5 rounded-2xl font-bold shadow-xl hover:bg-orange-50 transition-all transform hover:-translate-y-1 flex items-center gap-4 active:scale-95 group border-2 border-transparent hover:border-white/50"
                                    >
                                        <div className="bg-saffron text-white p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                                            <Download size={24} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs uppercase tracking-wider font-extrabold text-saffron-dark">Direct Download</p>
                                            <p className="text-xl md:text-2xl">Download Our Android App</p>
                                        </div>
                                    </a>
                                </div>
                            </motion.div>
                        </div>

                        {/* Image Column */}
                        <div className="lg:w-2/5 relative flex justify-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, type: "spring" }}
                                className="relative z-10 animate-float"
                            >
                                {/* Smartphone Frame Decoration */}
                                <div className="absolute -inset-4 bg-yellow-400/20 rounded-[3rem] blur-2xl -z-10"></div>
                                <img
                                    src={appMockup}
                                    alt="Vinayak Store Mobile App"
                                    className="w-full max-w-[320px] h-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)] cursor-pointer hover:rotate-2 transition-transform duration-500"
                                />
                            </motion.div>

                            {/* Floating Elements */}
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-10 -right-10 glass-card p-4 rounded-2xl hidden md:block"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-500 w-3 h-3 rounded-full animate-pulse"></div>
                                    <span className="text-xs font-bold text-gray-800">Fresh Marigold (1kg)</span>
                                </div>
                                <p className="text-[10px] text-gray-500 mt-1">Order placed 2 mins ago</p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AppDownloadSection;
