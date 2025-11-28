import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
    interface Window {
        umami?: {
            track: (payload: (props: any) => any) => void;
        };
    }
}

export const Analytics = () => {
    const location = useLocation();

    useEffect(() => {
        // Get environment variables or use hardcoded fallback
        const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID || '94e0c723-8fbe-40d6-b072-2b258febac8c';
        const scriptUrl = import.meta.env.VITE_UMAMI_SCRIPT_URL || 'https://stats.dulundu.tools/script.js';

        // Check if Umami is configured and not already loaded
        if (websiteId && !document.getElementById('umami-script')) {
            const script = document.createElement('script');
            script.id = 'umami-script';
            script.async = true;
            script.defer = true;
            script.src = scriptUrl;
            script.setAttribute('data-website-id', websiteId);

            // Auto-track handles initial load, but we might need manual for SPA transitions
            script.setAttribute('data-auto-track', 'true');

            document.head.appendChild(script);
        }
    }, []);

    // Track page views on route change
    useEffect(() => {
        if (window.umami) {
            // Manually track page view with new URL
            window.umami.track((props) => ({ ...props, url: location.pathname }));
        }
    }, [location]);

    return null;
};
