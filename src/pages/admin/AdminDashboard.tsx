import React from 'react';
import { ShoppingBag, Users, IndianRupee, Package } from 'lucide-react';

const AdminDashboard: React.FC = () => {
    // TODO: Fetch real stats from Firestore
    const stats = [
        { label: 'Total Sales', value: '₹45,200', icon: IndianRupee, color: 'bg-green-100 text-green-600' },
        { label: 'Total Orders', value: '128', icon: ShoppingBag, color: 'bg-blue-100 text-blue-600' },
        { label: 'Total Users', value: '85', icon: Users, color: 'bg-purple-100 text-purple-600' },
        { label: 'Total Products', value: '42', icon: Package, color: 'bg-orange-100 text-orange-600' },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
                        </div>
                        <div className={`p-3 rounded-full ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders Placeholder */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Orders</h3>
                    <div className="flex items-center justify-center h-48 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        No recent orders
                    </div>
                </div>

                {/* Low Stock Placeholder */}
                <div className="bg-white rounded-xl shadow-sm p-6">
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
