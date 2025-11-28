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
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200 pb-20">
            {/* Hero Section */}
            <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 relative overflow-hidden z-20 transition-colors duration-200">
                {/* Simple Grid Background */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.1] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>

                <div className="container mx-auto px-4 py-16 text-center max-w-4xl relative z-10">
                    <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-8 animate-fade-in border border-blue-100 dark:border-blue-800">
                        <Zap size={16} fill="currentColor" />
                        <span>100+ Free Developer Tools</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
                        Dulundu<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">.tools</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                        The ultimate suite of developer utilities. <br className="hidden md:block" />Beautify, convert, generate, and debug in seconds.
                    </p>

                    <div className="relative max-w-2xl mx-auto">
                        <div className="relative shadow-2xl shadow-blue-500/10 dark:shadow-blue-900/20 rounded-2xl group focus-within:ring-4 focus-within:ring-primary/20 transition-all duration-300 z-30 bg-white dark:bg-slate-800">
                            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                <Search className="text-slate-400 group-focus-within:text-primary transition-colors duration-300" size={24} />
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
                                className="w-full p-6 pl-16 rounded-2xl border border-gray-200 dark:border-slate-700 bg-transparent text-xl text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium"
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

            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* Sidebar Categories (Desktop) */}
                    <aside className="hidden lg:block w-64 shrink-0 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 custom-scrollbar">
                        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 px-2">Categories</h3>
                        <nav className="space-y-1">
                            <button
                                onClick={() => { setActiveCategory('All'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeCategory === 'All'
                                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <span className="flex items-center"><Grid size={16} className="mr-2.5" /> All Tools</span>
                                <span className={`text-xs px-1.5 py-0.5 rounded-md ${activeCategory === 'All' ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>{ALL_TOOLS.length}</span>
                            </button>

                            {sortedCategories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => { setActiveCategory(category); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeCategory === category
                                            ? 'bg-primary text-white shadow-md shadow-primary/20'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    <span>{category}</span>
                                    <span className={`text-xs px-1.5 py-0.5 rounded-md ${activeCategory === category ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>{categoryInfo[category].count}</span>
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* Mobile Category Scroll */}
                    <div className="lg:hidden w-full overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setActiveCategory('All')}
                                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === 'All'
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700'
                                    }`}
                            >
                                All Tools
                            </button>
                            {sortedCategories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === category
                                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <main className="flex-1 min-w-0">
                        {/* Popular Section (Only on 'All' view) */}
                        {isDirectoryView && (
                            <section className="mb-10 animate-fade-in">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="p-2 bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg">
                                        <TrendingUp size={20} />
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Popular Tools</h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {popularTools.map(tool => (
                                        <ToolCard key={tool.id} tool={tool} variant="mini" />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Filtered Tools Grid */}
                        <section className="animate-fade-in">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 text-primary rounded-lg">
                                        {activeCategory === 'All' ? <Grid size={20} /> : <Zap size={20} />}
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                                        {activeCategory === 'All' ? 'All Tools' : activeCategory}
                                    </h2>
                                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-md text-xs font-bold">
                                        {filteredTools.length}
                                    </span>
                                </div>
                            </div>

                            {filteredTools.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
                                    {filteredTools.map(tool => (
                                        <ToolCard key={tool.id} tool={tool} />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-gray-300 dark:border-slate-700">
                                    <div className="inline-block p-6 bg-gray-50 dark:bg-slate-700/50 rounded-full mb-4">
                                        <Search size={40} className="text-gray-400 dark:text-slate-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No tools found</h3>
                                    <p className="text-slate-500 dark:text-slate-400 max-w-md text-center">
                                        We couldn't find any tools matching "{searchTerm}". Try checking your spelling or browsing by category.
                                    </p>
                                    <button
                                        onClick={() => { setSearchTerm(''); setSearchParams({}); setActiveCategory('All'); }}
                                        className="mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            )}
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
};
