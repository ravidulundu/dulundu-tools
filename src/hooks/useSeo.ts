import { useEffect } from 'react';

interface SeoProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
}

const updateMeta = (property: string, content: string, isProperty = false) => {
  const selector = isProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`;
  let meta = document.querySelector(selector);

  if (meta) {
    meta.setAttribute('content', content);
  } else {
    meta = document.createElement('meta');
    meta.setAttribute(isProperty ? 'property' : 'name', property);
    meta.setAttribute('content', content);
    document.head.appendChild(meta);
  }
};

export const useSeo = ({ title, description, keywords, canonicalUrl, ogImage, ogType }: SeoProps) => {
  useEffect(() => {
    const siteName = 'Dulundu.tools';
    const siteUrl = 'https://dulundu.tools';
    const defaultTitle = 'Dulundu.tools - Free Developer Utilities';
    const defaultDescription =
      'The ultimate suite of developer utilities. 95+ free tools including JSON Formatter, Base64 Converter, AI Code Assistant, and more.';
    const defaultKeywords =
      'developer tools, json formatter, base64 converter, sql beautifier, ai code assistant, web tools, free utilities';
    const defaultOgImage = `${siteUrl}/og-image.png`;

    const fullTitle = title ? `${title} - ${siteName}` : defaultTitle;
    const finalDescription = description || defaultDescription;
    const finalOgImage = ogImage || defaultOgImage;
    const finalCanonical = canonicalUrl || window.location.href;

    // Title
    document.title = fullTitle;

    // Basic Meta
    updateMeta('description', finalDescription);
    updateMeta('keywords', keywords || defaultKeywords);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', finalCanonical);
    } else {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', finalCanonical);
      document.head.appendChild(canonical);
    }

    // Open Graph
    updateMeta('og:title', fullTitle, true);
    updateMeta('og:description', finalDescription, true);
    updateMeta('og:image', finalOgImage, true);
    updateMeta('og:url', finalCanonical, true);
    updateMeta('og:type', ogType || 'website', true);
    updateMeta('og:site_name', siteName, true);

    // Twitter Card
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', fullTitle);
    updateMeta('twitter:description', finalDescription);
    updateMeta('twitter:image', finalOgImage);
  }, [title, description, keywords, canonicalUrl, ogImage, ogType]);
};
