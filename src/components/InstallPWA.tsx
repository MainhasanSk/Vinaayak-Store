import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

const InstallPWA: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            // Update UI notify the user they can install the PWA
            setIsVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        // Show the prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-24 left-4 right-4 z-50 animate-bounce-in">
            <div className="bg-gradient-to-r from-saffron to-saffron-dark text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border-2 border-white/20 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-xl text-saffron shadow-inner">
                        <Download size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">Install Vinayak Store</h3>
                        <p className="text-[10px] text-yellow-100">Add to home screen for faster access!</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleInstallClick}
                        className="bg-white text-saffron px-4 py-2 rounded-lg font-bold text-xs shadow-sm active:scale-95 transition"
                    >
                        Install Now
                    </button>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="p-1 hover:bg-white/10 rounded-full transition"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstallPWA;
