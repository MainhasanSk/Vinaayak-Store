import React, { useEffect, useState } from 'react';
import { ShoppingBag, Users, IndianRupee, Package, AlertCircle } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const AdminDashboard: React.FC = () => {
    const [statsData, setStatsData] = useState({
        totalSales: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalProducts: 0,
        pendingOrders: 0
    });

    useEffect(() => {
        // Listen to Orders
        const unsubscribeOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
            let sales = 0;
            let pending = 0;
            snapshot.docs.forEach(doc => {
                const data = doc.data();
                sales += data.total || 0;
                if (data.status === 'pending') pending++;
            });
            setStatsData(prev => ({
                ...prev,
                totalOrders: snapshot.size,
                totalSales: sales,
                pendingOrders: pending
            }));
        });

        // Listen to Users
        const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
            setStatsData(prev => ({ ...prev, totalUsers: snapshot.size }));
        });

        // Listen to Products
        const unsubscribeProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
            setStatsData(prev => ({ ...prev, totalProducts: snapshot.size }));
        });

        return () => {
            unsubscribeOrders();
            unsubscribeUsers();
            unsubscribeProducts();
        };
    }, []);

    const stats = [
        {
            label: 'Pending Orders',
            value: statsData.pendingOrders.toString(),
            icon: AlertCircle,
            color: 'bg-red-500 text-white',
            highlight: true
        },
        { label: 'Total Sales', value: `₹${statsData.totalSales.toLocaleString()}`, icon: IndianRupee, color: 'bg-green-100 text-green-600' },
        { label: 'Total Orders', value: statsData.totalOrders.toString(), icon: ShoppingBag, color: 'bg-blue-100 text-blue-600' },
        { label: 'Total Users', value: statsData.totalUsers.toString(), icon: Users, color: 'bg-purple-100 text-purple-600' },
        { label: 'Total Products', value: statsData.totalProducts.toString(), icon: Package, color: 'bg-orange-100 text-orange-600' },
    ];

    return (
        <div className="p-2 md:p-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard Overview</h1>
                {statsData.pendingOrders > 0 && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg flex items-center gap-2 animate-pulse shadow-sm">
                        <AlertCircle size={20} />
                        <span className="font-bold text-sm">{statsData.pendingOrders} Orders Pending Attention</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className={`rounded-xl shadow-sm p-6 flex items-center justify-between transition-transform hover:scale-105 duration-200 ${stat.highlight
                            ? 'bg-red-600 text-white ring-4 ring-red-100'
                            : 'bg-white text-gray-900 border border-gray-100'
                            }`}
                    >
                        <div>
                            <p className={`${stat.highlight ? 'text-red-100' : 'text-gray-500'} text-xs font-bold uppercase tracking-wider`}>{stat.label}</p>
                            <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
                        </div>
                        <div className={`p-3 rounded-full ${stat.highlight ? 'bg-white/20' : stat.color}`}>
                            <stat.icon size={26} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders Placeholder */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Orders</h3>
                    <div className="flex items-center justify-center h-48 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        No recent orders
                    </div>
                </div>

                {/* Low Stock Placeholder */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Low Stock Alert</h3>
                    <div className="flex items-center justify-center h-48 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        All products in stock
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
