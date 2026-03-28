import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

const AdminLayout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Mobile Header */}
                <header className="lg:hidden bg-saffron-dark text-white p-4 flex items-center justify-between shadow-md z-30">
                    <h2 className="text-xl font-bold font-serif">Vinayak Admin</h2>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 hover:bg-orange-600 rounded-lg transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                </header>

                <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
