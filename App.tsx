


import React, { useState, useMemo, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useSearchParams } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ToolCard } from './components/ToolCard';
import { CategoryCard } from './components/CategoryCard';
import { ALL_TOOLS } from './constants';
import { Search, TrendingUp, Grid, Zap, ArrowRight } from 'lucide-react';

// Tool Components
import { JsonFormatter } from './features/JsonFormatter';
import { Base64Converter } from './features/Base64Converter';
import { AiAssistant } from './features/AiAssistant';
import { ComingSoon } from './features/ComingSoon';
import { WordCounter } from './features/WordCounter';
import { UuidGenerator } from './features/UuidGenerator';
import { LoremGenerator } from './features/LoremGenerator';
import { UrlEncoder } from './features/UrlEncoder';
import { ColorConverter } from './features/ColorConverter';
import { CodeMinifier } from './features/CodeMinifier';
import { HashGenerator } from './features/HashGenerator';
import { DiffViewer } from './features/DiffViewer';
import { PasswordGenerator } from './features/PasswordGenerator';
import { ImageConverter } from './features/ImageConverter';
import { UnitConverter } from './features/UnitConverter';
import { NumberConverter } from './features/NumberConverter';
import { SqlFormatter } from './features/SqlFormatter';
import { GradientGenerator } from './features/GradientGenerator';
import { HtmlTableGenerator } from './features/HtmlTableGenerator';
import { TextStyler } from './features/TextStyler';
import { EscapeTools } from './features/EscapeTools';
import { MarkdownTools } from './features/MarkdownTools';
import { XmlFormatter } from './features/XmlFormatter';
import { CsvConverter } from './features/CsvConverter';
import { LoanCalculator } from './features/LoanCalculator';

// Recently Added Components
import { MyIp } from './features/MyIp';
import { CssUnitConverter } from './features/CssUnitConverter';
import { CodeFormatter } from './features/CodeFormatter';
import { TwitterCardGenerator } from './features/TwitterCardGenerator';
import { JsonConverter } from './features/JsonConverter';
import { GstCalculator } from './features/GstCalculator';
import { HtmlStripper } from './features/HtmlStripper';
import { RandomGenerator } from './features/RandomGenerator';
import { TsvConverter } from './features/TsvConverter';
import { SqlConverter } from './features/SqlConverter';

// Batch 3
import { XmlJsonConverter } from './features/XmlJsonConverter';
import { DnsLookup } from './features/DnsLookup';
import { PojoGenerator } from './features/PojoGenerator';
import { Utf8Converter } from './features/Utf8Converter';
import { CsvXmlConverter } from './features/CsvXmlConverter';

// Batch 4
import { JwtDecoder } from './features/JwtDecoder';
import { GzipCompressor } from './features/GzipCompressor';
import { QrcodeGenerator } from './features/QrcodeGenerator';
import { ChmodCalculator } from './features/ChmodCalculator';
import { CronGenerator } from './features/CronGenerator';

// Batch 5
import { YamlConverter } from './features/YamlConverter';
import { WhoisLookup } from './features/WhoisLookup';
import { JsValidator } from './features/JsValidator';

// Batch 6
import { RegexTester } from './features/RegexTester';
import { DateConverter } from './features/DateConverter';
import { ListComparator } from './features/ListComparator';
import { TextCaseConverter } from './features/TextCaseConverter';
import { UaParser } from './features/UaParser';

// Batch 7
import { MarkdownEditor } from './features/MarkdownEditor';
import { BitwiseCalculator } from './features/BitwiseCalculator';
import { BcryptGenerator } from './features/BcryptGenerator';
import { HmacGenerator } from './features/HmacGenerator';
import { SlugGenerator } from './features/SlugGenerator';

// Batch 8 (Final)
import { RsaGenerator } from './features/RsaGenerator';
import { TokenGenerator } from './features/TokenGenerator';
import { HttpStatusCodes } from './features/HttpStatusCodes';
import { MetaTagGenerator } from './features/MetaTagGenerator';
import { PaletteExtractor } from './features/PaletteExtractor';

// Batch 9 (New Requests)
import { NumberSorter } from './features/NumberSorter';
import { RemovePunctuation } from './features/RemovePunctuation';
import { HtmlEditor } from './features/HtmlEditor';
import { LuaMinifier } from './features/LuaMinifier';
import { LuaBeautifier } from './features/LuaBeautifier';
import { PhpFormatter } from './features/PhpFormatter';
import { WordpressPasswordHash } from './features/WordpressPasswordHash';
import { ImageToAscii } from './features/ImageToAscii';
import { ExcelViewer } from './features/ExcelViewer';
import { CsvToExcel } from './features/CsvToExcel';
import { ParaphrasingTool } from './features/ParaphrasingTool';
import { MirrorOnline } from './features/MirrorOnline';
import { WordToHtml } from './features/WordToHtml';
import { SharelinkGenerator } from './features/SharelinkGenerator';

const Home: React.FC = () => {
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
      const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  // Global search suggestions for dropdown
  const searchSuggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return ALL_TOOLS.filter(tool =>
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase())
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

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/json-formatter" element={<JsonFormatter />} />
          <Route path="/base64-converter" element={<Base64Converter />} />
          <Route path="/ai-assistant" element={<AiAssistant />} />

          {/* Implemented Tools */}
          <Route path="/word-counter" element={<WordCounter />} />
          <Route path="/uuid-generator" element={<UuidGenerator />} />
          <Route path="/lorem-ipsum" element={<LoremGenerator />} />
          <Route path="/url-encoder" element={<UrlEncoder />} />
          <Route path="/color-converter" element={<ColorConverter />} />
          <Route path="/code-minifier" element={<CodeMinifier />} />
          <Route path="/hash-generator" element={<HashGenerator />} />
          <Route path="/diff-viewer" element={<DiffViewer />} />
          <Route path="/password-generator" element={<PasswordGenerator />} />
          <Route path="/image-converter" element={<ImageConverter />} />
          <Route path="/unit-converter" element={<UnitConverter />} />
          <Route path="/number-converter" element={<NumberConverter />} />
          <Route path="/sql-formatter" element={<SqlFormatter />} />
          <Route path="/gradient-generator" element={<GradientGenerator />} />
          <Route path="/html-table-generator" element={<HtmlTableGenerator />} />
          <Route path="/text-styler" element={<TextStyler />} />
          <Route path="/escape-tools" element={<EscapeTools />} />
          <Route path="/markdown-tools" element={<MarkdownTools />} />
          <Route path="/xml-formatter" element={<XmlFormatter />} />
          <Route path="/csv-converter" element={<CsvConverter />} />
          <Route path="/loan-calculator" element={<LoanCalculator />} />

          {/* Feature Set 1 */}
          <Route path="/my-ip" element={<MyIp />} />
          <Route path="/css-unit-converter" element={<CssUnitConverter />} />
          <Route path="/code-formatter" element={<CodeFormatter />} />
          <Route path="/twitter-card-generator" element={<TwitterCardGenerator />} />
          <Route path="/json-converter" element={<JsonConverter />} />

          {/* Feature Set 2 */}
          <Route path="/gst-calculator" element={<GstCalculator />} />
          <Route path="/html-stripper" element={<HtmlStripper />} />
          <Route path="/random-generator" element={<RandomGenerator />} />
          <Route path="/tsv-converter" element={<TsvConverter />} />
          <Route path="/sql-converter" element={<SqlConverter />} />

          {/* Feature Set 3 */}
          <Route path="/xml-json-converter" element={<XmlJsonConverter />} />
          <Route path="/dns-lookup" element={<DnsLookup />} />
          <Route path="/pojo-generator" element={<PojoGenerator />} />
          <Route path="/utf8-converter" element={<Utf8Converter />} />
          <Route path="/csv-to-xml" element={<CsvXmlConverter />} />

          {/* Feature Set 4 */}
          <Route path="/jwt-decoder" element={<JwtDecoder />} />
          <Route path="/gzip-compressor" element={<GzipCompressor />} />
          <Route path="/qrcode-generator" element={<QrcodeGenerator />} />
          <Route path="/chmod-calculator" element={<ChmodCalculator />} />
          <Route path="/cron-generator" element={<CronGenerator />} />

          {/* Feature Set 5 */}
          <Route path="/yaml-converter" element={<YamlConverter />} />
          <Route path="/whois-lookup" element={<WhoisLookup />} />
          <Route path="/js-validator" element={<JsValidator />} />

          {/* Feature Set 6 */}
          <Route path="/regex-tester" element={<RegexTester />} />
          <Route path="/date-converter" element={<DateConverter />} />
          <Route path="/list-comparator" element={<ListComparator />} />
          <Route path="/case-converter" element={<TextCaseConverter />} />
          <Route path="/ua-parser" element={<UaParser />} />

          {/* Feature Set 7 */}
          <Route path="/markdown-editor" element={<MarkdownEditor />} />
          <Route path="/bitwise-calculator" element={<BitwiseCalculator />} />
          <Route path="/bcrypt-generator" element={<BcryptGenerator />} />
          <Route path="/hmac-generator" element={<HmacGenerator />} />
          <Route path="/slug-generator" element={<SlugGenerator />} />

          {/* Feature Set 8 (Final) */}
          <Route path="/rsa-generator" element={<RsaGenerator />} />
          <Route path="/token-generator" element={<TokenGenerator />} />
          <Route path="/http-status-codes" element={<HttpStatusCodes />} />
          <Route path="/meta-tag-generator" element={<MetaTagGenerator />} />
          <Route path="/palette-extractor" element={<PaletteExtractor />} />

          {/* Batch 9 (New Requests) */}
          <Route path="/number-sorter" element={<NumberSorter />} />
          <Route path="/remove-punctuation" element={<RemovePunctuation />} />
          <Route path="/html-editor" element={<HtmlEditor />} />
          <Route path="/lua-minifier" element={<LuaMinifier />} />
          <Route path="/lua-beautifier" element={<LuaBeautifier />} />
          <Route path="/php-formatter" element={<PhpFormatter />} />
          <Route path="/wordpress-password-hash" element={<WordpressPasswordHash />} />
          <Route path="/image-to-ascii" element={<ImageToAscii />} />
          <Route path="/excel-viewer" element={<ExcelViewer />} />
          <Route path="/csv-to-excel" element={<CsvToExcel />} />
          <Route path="/paraphrasing-tool" element={<ParaphrasingTool />} />
          <Route path="/mirror-online" element={<MirrorOnline />} />
          <Route path="/word-to-html" element={<WordToHtml />} />
          <Route path="/sharelink-generator" element={<SharelinkGenerator />} />

          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="*" element={<ComingSoon />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
