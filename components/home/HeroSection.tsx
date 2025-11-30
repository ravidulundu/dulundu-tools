import React from "react";
import { Zap, Search, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface HeroSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 relative z-20 transition-colors duration-200">
      {/* Background Wrapper with Overflow Hidden */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        {/* Simple Grid Background */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.1]"
          style={{
            backgroundImage: "radial-gradient(#3b82f6 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        ></div>
        <div className="absolute left-0 right-0 top-0 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-4 py-16 text-center max-w-4xl relative z-10">
        <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-8 animate-fade-in border border-blue-100 dark:border-blue-800">
          <Zap size={16} fill="currentColor" />
          <span>100+ Free Developer Tools</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
          Dulundu
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
            .tools
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
          The ultimate suite of developer utilities.{" "}
          <br className="hidden md:block" />
          Beautify, convert, generate, and debug in seconds.
        </p>

        <div className="relative max-w-2xl mx-auto">
          <div className="relative shadow-2xl shadow-blue-500/10 dark:shadow-blue-900/20 rounded-2xl group focus-within:ring-4 focus-within:ring-primary/20 transition-all duration-300 z-30 bg-white dark:bg-slate-800">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <Search
                className="text-slate-400 group-focus-within:text-primary transition-colors duration-300"
                size={24}
              />
            </div>
            <input
              type="text"
              placeholder="Search tools (e.g., JSON, Base64, Color)..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              className="w-full p-6 pl-16 rounded-2xl border border-gray-200 dark:border-slate-700 bg-transparent text-xl text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
