import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { HeroSection } from '@/components/home/HeroSection';
import { Sidebar } from '@/components/home/Sidebar';
import { ToolGrid } from '@/components/home/ToolGrid';
import { SEO } from '@/components/SEO';
import { ALL_TOOLS } from '@/constants';

export const Home: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');

  const activeCategory = searchParams.get('category') || 'All';

  const setActiveCategory = (category: string) => {
    if (category === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ ...Object.fromEntries(searchParams), category });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter tools based on search and category
  const filteredTools = useMemo(() => {
    return ALL_TOOLS.filter(tool => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        tool.name.toLowerCase().includes(searchLower) ||
        tool.description.toLowerCase().includes(searchLower) ||
        tool.category.toLowerCase().includes(searchLower) ||
        tool.tags?.some(tag => tag.toLowerCase().includes(searchLower));
      const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
      return matchesSearch && matchesCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  const popularTools = useMemo(() => ALL_TOOLS.filter(t => t.popular), []);

  const isDirectoryView = !searchTerm && activeCategory === 'All';

  // Category info with tool counts and representative tool path
  const categoryInfo = useMemo(() => {
    const info: Record<string, { count: number; path: string }> = {};

    // Group tools by category
    const byCategory: Record<string, typeof ALL_TOOLS> = {};
    ALL_TOOLS.forEach(tool => {
      if (!byCategory[tool.category]) {
        byCategory[tool.category] = [];
      }
      byCategory[tool.category].push(tool);
    });

    // For each category, pick the best representative tool
    Object.entries(byCategory).forEach(([category, tools]) => {
      // Prefer: non-popular, non-new tools first (core tools)
      // Then non-popular tools, then any tool
      const coreTools = tools.filter(t => !t.popular && !t.isNew);
      const regularTools = tools.filter(t => !t.popular);

      const representative = coreTools[0] || regularTools[0] || tools[0];

      info[category] = {
        count: tools.length,
        path: representative.path,
      };
    });

    return info;
  }, []);

  const sortedCategories = useMemo(() => {
    return Object.keys(categoryInfo).sort();
  }, [categoryInfo]);

  return (
    <div className="min-h-screen bg-background-secondary transition-colors duration-200 pb-20">
      <SEO
        title="Dulundu Tools - Ultimate Developer Utilities Collection"
        description="Access 100+ free developer tools including JSON Formatter, Base64 Converter, SQL Beautifier, AI Code Helper, and more. Fast, secure, and client-side."
        keywords="developer tools, json formatter, base64 converter, sql beautifier, ai code helper, web tools, online utilities, free dev tools"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Dulundu Tools',
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Web Browser',
          url: import.meta.env.VITE_APP_URL || 'https://dulundu.tools',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
          description:
            'A comprehensive suite of free developer utilities including AI Code Helper, JSON Formatter, and 100+ other tools.',
          featureList:
            'AI Code Assistant, SVG Viewer, JSON Formatter, Base64 Converter, SQL Beautifier, Regex Tester, Cron Generator',
          author: {
            '@type': 'Person',
            name: 'Ravi Dulundu',
          },
        }}
      />

      <HeroSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <Sidebar
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            sortedCategories={sortedCategories}
            categoryInfo={categoryInfo}
          />

          <ToolGrid
            isDirectoryView={isDirectoryView}
            popularTools={popularTools}
            activeCategory={activeCategory}
            filteredTools={filteredTools}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setSearchParams={setSearchParams}
            setActiveCategory={setActiveCategory}
          />
        </div>
      </div>
    </div>
  );
};
