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

export const SEO: React.FC<SEOProps & { structuredData?: Record<string, unknown> }> = ({
  structuredData,
  ...props
}) => {
  useSeo(props);

  if (structuredData) {
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    );
  }
  return null;
};
