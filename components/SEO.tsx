import React from 'react';
import { useSeo } from '../hooks/useSeo';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    canonicalUrl?: string;
    ogImage?: string;
    ogType?: string;
}

export const SEO: React.FC<SEOProps> = (props) => {
    useSeo(props);
    return null;
};
