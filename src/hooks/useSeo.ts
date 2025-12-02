import { useEffect } from 'react';

interface SeoProps {
    title?: string;
    description?: string;
    keywords?: string;
}

export const useSeo = ({ title, description, keywords }: SeoProps) => {
    useEffect(() => {
        const siteName = 'Dulundu.tools';
        const defaultTitle = 'Dulundu.tools - Free Developer Utilities';
        const defaultDescription = 'A comprehensive collection of free developer tools including formatters, converters, generators, and AI assistants.';
        const defaultKeywords = 'developer tools, json formatter, base64 converter, sql beautifier, ai code assistant, web tools, free utilities';

        // Update Title
        const fullTitle = title ? `${title} - ${siteName}` : defaultTitle;
        document.title = fullTitle;

        // Update Meta Description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', description || defaultDescription);
        } else {
            const meta = document.createElement('meta');
            meta.name = 'description';
            meta.content = description || defaultDescription;
            document.head.appendChild(meta);
        }

        // Update Meta Keywords
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
            metaKeywords.setAttribute('content', keywords || defaultKeywords);
        } else {
            const meta = document.createElement('meta');
            meta.name = 'keywords';
            meta.content = keywords || defaultKeywords;
            document.head.appendChild(meta);
        }

    }, [title, description, keywords]);
};
