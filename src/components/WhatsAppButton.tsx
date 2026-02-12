import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton: React.FC = () => {
    const phoneNumber = '919876543210'; // Replace with your WhatsApp business number
    const message = 'Hello! I would like to place an order.';

    const handleWhatsAppClick = () => {
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <button
            onClick={handleWhatsAppClick}
            className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-3 px-6 py-4 group animate-bounce hover:animate-none"
            aria-label="Order via WhatsApp"
        >
            <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-sm whitespace-nowrap">Order Via Whatsapp</span>
        </button>
    );
};

export default WhatsAppButton;
