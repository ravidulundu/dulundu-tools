import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { ALL_TOOLS } from '../constants';
import { SEO } from './SEO';

export const SeoManager: React.FC = () => {
    const location = useLocation();

    const currentTool = useMemo(() => {
        return ALL_TOOLS.find(tool => tool.path === location.pathname);
    }, [location.pathname]);

    if (currentTool) {
        return (
            <SEO
                title={currentTool.name}
                description={currentTool.description}
                keywords={`${currentTool.name}, ${currentTool.category}, developer tools, online utility`}
            />
        );
    }

    // Default SEO for Home and other pages
    if (location.pathname === '/') {
        return <SEO />; // Uses defaults defined in SEO.tsx
    }

    // Fallback for 404 or unknown routes
    return <SEO title="Page Not Found" />;
};
