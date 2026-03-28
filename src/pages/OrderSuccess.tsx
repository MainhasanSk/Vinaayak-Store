import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const OrderSuccess: React.FC = () => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
            <div className="bg-green-100 p-6 rounded-full mb-6 animate-bounce">
                <CheckCircle size={64} className="text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 font-serif">Order Placed Successfully!</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Thank you for choosing Vinayak Store. Your order has been received and will be processed shortly. May the blessings be with you!
            </p>
            <div className="flex gap-4">
                <Link to="/shop" className="bg-saffron hover:bg-saffron-dark text-white font-bold py-3 px-8 rounded-full shadow-lg transition">
                    Continue Shopping
                </Link>
                <Link to="/dashboard" className="bg-white text-saffron-dark border-2 border-saffron font-bold py-3 px-8 rounded-full hover:bg-orange-50 transition">
                    View Order
                </Link>
            </div>
        </div>
    );
};

export default OrderSuccess;
