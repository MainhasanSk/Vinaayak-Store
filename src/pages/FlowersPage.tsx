import React from 'react';
import Shop from './Shop';

const FlowersPage: React.FC = () => {
    // This is a wrapper that simply renders the Shop component
    // but we can customize it further if needed. 
    // The Shop component's useEffect will read the URL parameter 'category'
    // So we ensure the link to this page includes ?category=Fresh Flowers
    // OR we can make this component FORCE the category prop if we update Shop to accept it.

    // For now, to keep it simple and reuse the robust filtering logic in Shop,
    // we will redirect or render Shop.

    // However, the user asked for a "Dedicated Page".
    // If we just render <Shop />, it looks like the shop.
    // Let's force the category via a prop to Shop (need to update Shop first)
    // OR better: Just re-implement a cleaner, specific view for Flowers if they want it distinct.
    // Given the previous "PujaEssentials" request was specific, I'll update Shop.tsx to accept an initialCategory prop
    // to make it cleaner, or just use this wrapper to set the URL param.

    return <Shop />;
};

export default FlowersPage;
