import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { ALL_TOOLS } from '@/config/allTools';
import { useSeo } from '../hooks/useSeo';

const SITE_URL = 'https://dulundu.tools';

// Organization schema - site geneli
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Dulundu.tools',
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
  description: 'Free developer utilities suite with 95+ tools',
  sameAs: ['https://github.com/ravidulundu/dulundu-tools'],
};

// WebSite schema - anasayfa
const webSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Dulundu.tools',
  url: SITE_URL,
  description:
    'The ultimate suite of developer utilities. Beautify, convert, generate, and debug with our collection of 95+ free tools.',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/?search={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export const SeoManager: React.FC = () => {
  const location = useLocation();
  const canonicalUrl = `${SITE_URL}${location.pathname}`;

  const currentTool = useMemo(() => {
    return ALL_TOOLS.find(tool => tool.path === location.pathname);
  }, [location.pathname]);

  // Merkezi SEO hook - tüm meta tags burada yönetiliyor
  useSeo({
    title: currentTool?.name,
    description: currentTool?.description,
    keywords: currentTool?.tags?.join(', '),
    canonicalUrl,
  });

  // JSON-LD Schema
  const schemas = useMemo(() => {
    const result: object[] = [];

    // Anasayfa: Organization + WebSite
    if (location.pathname === '/') {
      result.push(organizationSchema, webSiteSchema);
    }

    // Tool sayfası: WebApplication
    if (currentTool) {
      result.push({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: currentTool.name,
        description: currentTool.description,
        url: canonicalUrl,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Any',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        author: {
          '@type': 'Organization',
          name: 'Dulundu.tools',
        },
      });
    }

    return result;
  }, [currentTool, location.pathname, canonicalUrl]);

  // JSON-LD script tags - using children instead of dangerouslySetInnerHTML
  return (
    <>
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </>
  );
};
