import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, TrendingUp, Grid, Zap, ArrowRight } from 'lucide-react';
import { ALL_TOOLS } from '../constants';
import { ToolCard } from '../components/ToolCard';
import { CategoryCard } from '../components/CategoryCard';

export const Home: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>('All');
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Read category from URL on mount and when URL changes
    useEffect(() => {
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
            setActiveCategory(categoryParam);
            // Scroll to top when category changes
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // No category in URL = reset to 'All'
            setActiveCategory('All');
        }
    }, [searchParams]);

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
        });
    }, [searchTerm, activeCategory]);

    // Global search suggestions for dropdown
    const searchSuggestions = useMemo(() => {
        if (!searchTerm.trim()) return [];
        const searchLower = searchTerm.toLowerCase();
        return ALL_TOOLS.filter(tool =>
            tool.name.toLowerCase().includes(searchLower) ||
            tool.description.toLowerCase().includes(searchLower) ||
            tool.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        );
    }, [searchTerm]);

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
                path: representative.path
            };
        });

        return info;
    }, []);

    const sortedCategories = useMemo(() => {
        return Object.keys(categoryInfo).sort();
    }, [categoryInfo]);

    const handleSearchBlur = () => {
        setTimeout(() => {
            setShowSuggestions(false);
        }, 200);
    };

    return (
        <div className="pb-16 bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
            {/* Hero Section */}
            <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 relative overflow-visible z-20 transition-colors duration-200">
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.1] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                <div className="container mx-auto px-4 py-16 text-center max-w-4xl relative z-10">
                    <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 text-primary px-3 py-1 rounded-full text-sm font-medium mb-6 animate-fade-in">
                        <Zap size={14} fill="currentColor" />
                        <span>100+ Free Developer Tools</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
                        Dulundu<span className="text-primary">.tools</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        The ultimate suite of developer utilities. Beautify, convert, generate, and debug in seconds.
                    </p>

                    <div className="relative max-w-2xl mx-auto">
                        <div className="relative shadow-xl shadow-primary/5 dark:shadow-primary/10 rounded-2xl group focus-within:ring-4 focus-within:ring-primary/20 transition-all z-30">
                            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                <Search className="text-slate-400 group-focus-within:text-primary transition-colors" size={24} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search tools (e.g., JSON, Base64, Color)..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onFocus={() => setShowSuggestions(true)}
                                onBlur={handleSearchBlur}
                                className="w-full p-5 pl-16 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-lg text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-500 font-medium"
                            />
                        </div>

                        {/* Search Autocomplete Dropdown */}
                        {showSuggestions && searchTerm && searchSuggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden z-40 max-h-[360px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                                {searchSuggestions.map((tool) => (
                                    <Link
                                        key={tool.id}
                                        to={tool.path}
                                        className="flex items-center p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 border-b border-gray-50 dark:border-slate-700 last:border-0 transition-colors group text-left"
                                        onClick={() => setShowSuggestions(false)}
                                    >
                                        <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-primary rounded-lg mr-4 group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                                            <tool.icon size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-slate-800 dark:text-slate-200 text-sm group-hover:text-primary dark:group-hover:text-primary transition-colors flex items-center">
                                                {tool.name}
                                                {tool.popular && <span className="ml-2 text-[10px] bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-1.5 py-0.5 rounded font-bold uppercase">Popular</span>}
                                            </div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{tool.description}</div>
                                        </div>
                                        <ArrowRight size={16} className="text-gray-300 dark:text-slate-600 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0 ml-3" />
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 space-y-16">

                {/* Popular Section */}
                {isDirectoryView && (
                    <section className="animate-fade-in">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg">
                                    <TrendingUp size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Essential Developer Tools</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">The most commonly used tools for everyday development</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {popularTools.map(tool => (
                                <ToolCard key={tool.id} tool={tool} variant="mini" />
                            ))}
                        </div>
                    </section>
                )}

                {/* Directory / Search Results Section */}
                <section id="all-tools" className="animate-fade-in">
                    {/* If searching or filtering, show filtered results */}
                    {!isDirectoryView ? (
                        <>
                            <div className="flex items-center space-x-3 mb-8">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 text-primary rounded-lg">
                                    <Search size={24} />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Search Results</h2>
                                <button
                                    onClick={() => { setSearchTerm(''); setSearchParams({}); }}
                                    className="ml-auto text-sm text-primary hover:underline font-medium"
                                >
                                    Clear & Show All
                                </button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                {filteredTools.length > 0 ? (
                                    filteredTools.map(tool => (
                                        <ToolCard key={tool.id} tool={tool} variant="mini" />
                                    ))
                                ) : (
                                    <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-gray-300 dark:border-slate-700">
                                        <div className="inline-block p-6 bg-gray-50 dark:bg-slate-700/50 rounded-full mb-4">
                                            <Search size={40} className="text-gray-400 dark:text-slate-500" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No tools found</h3>
                                        <p className="text-slate-500 dark:text-slate-400 max-w-md text-center">
                                            We couldn't find any tools matching "{searchTerm}". Try checking your spelling or browsing by category.
                                        </p>
                                        <button
                                            onClick={() => { setSearchTerm(''); setSearchParams({}); }}
                                            className="mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                                        >
                                            Clear Filters
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        /* Clean Directory View - Category Cards Only */
                        <>
                            <div className="flex items-center space-x-3 mb-8">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 text-primary rounded-lg">
                                    <Grid size={24} />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Browse by Category</h2>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {sortedCategories.map(category => (
                                    <CategoryCard
                                        key={category}
                                        category={category}
                                        toolCount={categoryInfo[category].count}
                                        onClick={() => {
                                            setSearchParams({ category });
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </section>
            </div>
        </div>
    );
};
