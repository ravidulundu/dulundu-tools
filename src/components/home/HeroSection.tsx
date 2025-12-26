import { Zap, Search } from 'lucide-react';
import React from 'react';

interface HeroSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="bg-card border-b border-border relative z-20 transition-colors duration-200">
      {/* Background Wrapper with Overflow Hidden */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        {/* Simple Grid Background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(rgb(var(--primary)) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        ></div>
        <div className="absolute left-0 right-0 top-0 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-4 py-16 text-center max-w-4xl relative z-10">
        <div className="inline-flex items-center space-x-2 bg-primary-light text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-8 animate-fade-in border border-primary/20">
          <Zap size={16} fill="currentColor" />
          <span>100+ Free Developer Tools</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-foreground mb-6 tracking-tight leading-tight">
          Dulundu
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
            .tools
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-foreground-secondary mb-12 max-w-2xl mx-auto leading-relaxed font-light">
          The ultimate suite of developer utilities. <br className="hidden md:block" />
          Beautify, convert, generate, and debug in seconds.
        </p>

        <div className="relative max-w-2xl mx-auto">
          <div className="relative shadow-2xl shadow-primary/10 rounded-2xl group focus-within:ring-4 focus-within:ring-primary/20 transition-all duration-300 z-30 bg-card">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <Search
                className="text-foreground-muted group-focus-within:text-primary transition-colors duration-300"
                size={24}
              />
            </div>
            <input
              type="text"
              placeholder="Search tools (e.g., JSON, Base64, Color)..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
              }}
              className="w-full p-6 pl-16 rounded-2xl border border-border bg-transparent text-xl text-foreground outline-none transition-all placeholder:text-foreground-muted font-medium"
            />
          </div>
        </div>

        <p className="mt-6 text-sm text-foreground-muted flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success"></span>
          🔒 Client-side only. Your data never leaves your browser.
        </p>
      </div>
    </div>
  );
};
