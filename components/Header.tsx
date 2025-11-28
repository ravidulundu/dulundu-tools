import React, { useState, Suspense } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code2, Menu, Sun, Moon, Github, MessageSquare, ChevronDown, X, Heart } from 'lucide-react';

const MegaMenu = React.lazy(() => import('./MegaMenu'));
const MobileMenu = React.lazy(() => import('./MobileMenu'));

interface HeaderProps {
    darkMode: boolean;
    toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ darkMode, toggleTheme }) => {
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [megaMenuOpen, setMegaMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'AI Assistant', path: '/ai-assistant' },
        { name: 'JSON Tools', path: '/json-formatter' },
    ];

    return (
        <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm/50 transition-colors duration-200">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">

                {/* Left: Logo */}
                <Link to="/" className="flex items-center space-x-2 group shrink-0">
                    <div className="bg-primary text-white p-1.5 rounded-lg group-hover:bg-blue-600 transition-colors shadow-sm">
                        <Code2 size={22} />
                    </div>
                    <span className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">Dulundu<span className="text-primary">.tools</span></span>
                </Link>

                {/* Center: Navigation Links */}
                <nav className="hidden md:flex items-center justify-center space-x-1">
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-primary font-semibold'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-slate-800'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}

                    {/* Developer Tools Mega Menu */}
                    <div
                        className="relative px-4 py-2 cursor-pointer"
                        onMouseEnter={() => setMegaMenuOpen(true)}
                        onMouseLeave={() => setMegaMenuOpen(false)}
                    >
                        <span className="text-sm font-medium flex items-center text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
                            Developer Tools <ChevronDown size={14} className={`ml-1 opacity-70 transition-transform ${megaMenuOpen ? 'rotate-180' : ''}`} />
                        </span>

                        {/* Mega Menu Dropdown */}
                        <Suspense fallback={null}>
                            {megaMenuOpen && (
                                <MegaMenu isOpen={megaMenuOpen} onClose={() => setMegaMenuOpen(false)} />
                            )}
                        </Suspense>
                    </div>
                </nav>

                {/* Right: Actions (4 Icons: Github, Discord, Chat, Sun) */}
                <div className="flex items-center space-x-3 shrink-0">

                    {/* Donate Button (Desktop) */}
                    <a
                        href="https://donate.stripe.com/6oU6oG537fBTbW94Lig7e00"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => (window as any).umami?.track('Donate Header Click')}
                        className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium text-sm"
                        title="Support the project"
                    >
                        <Heart size={16} className="fill-white/20" />
                        <span>Sponsor</span>
                    </a>

                    {/* Github */}
                    <a
                        href="https://github.com/ravidulundu/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                        title="GitHub"
                    >
                        <Github size={20} />
                    </a>

                    {/* Discussions */}
                    <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                        title="Discussions"
                    >
                        <MessageSquare size={20} />
                    </a>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-yellow-400 hover:bg-orange-50 dark:hover:bg-yellow-400/10 rounded-lg transition-all"
                        title="Toggle Theme"
                    >
                        {darkMode ? <Moon size={20} /> : <Sun size={20} />}
                    </button>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg ml-1"
                        aria-label="Toggle mobile menu"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <Suspense fallback={null}>
                {mobileMenuOpen && (
                    <MobileMenu onClose={() => setMobileMenuOpen(false)} navLinks={navLinks} />
                )}
            </Suspense>
        </header>
    );
};
