import { useEffect } from 'react';

export const Analytics = () => {
    useEffect(() => {
        // Get environment variables
        const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID;
        const scriptUrl = import.meta.env.VITE_UMAMI_SCRIPT_URL || 'https://analytics.umami.is/script.js';

        // Check if Umami is configured and not already loaded
        if (websiteId && !document.getElementById('umami-script')) {
            const script = document.createElement('script');
            script.id = 'umami-script';
            script.async = true;
            script.defer = true;
            script.src = scriptUrl;
            script.setAttribute('data-website-id', websiteId);

            // Optional: Enable auto-track (default is true, but explicit is good)
            script.setAttribute('data-auto-track', 'true');

            document.head.appendChild(script);

            console.log('Umami Analytics initialized');
        }
    }, []);

    return null;
};
