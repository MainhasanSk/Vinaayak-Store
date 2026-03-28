import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50 text-center px-4">
            <h1 className="text-9xl font-bold text-saffron/20">404</h1>
            <h2 className="text-3xl font-bold text-gray-800 -mt-12 mb-4">Page Not Found</h2>
            <p className="text-gray-600 mb-8">The page you are looking for might have been removed or does not exist.</p>
            <Link
                to="/"
                className="flex items-center gap-2 bg-saffron hover:bg-saffron-dark text-white font-bold py-3 px-8 rounded-full shadow-lg transition"
            >
                <Home size={20} /> Go Home
            </Link>
        </div>
    );
};

export default NotFound;
