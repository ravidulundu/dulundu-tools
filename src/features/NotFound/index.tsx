import { Home, ArrowLeft } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

import { SEO } from '@/components/SEO';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
      <SEO title="Page Not Found" description="The page you are looking for does not exist." />

      <div className="w-full max-w-md mb-8">
        <svg
          viewBox="0 0 400 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M200 50C117.157 50 50 117.157 50 200H350C350 117.157 282.843 50 200 50Z"
            fill="#E2E8F0"
            className="dark:fill-slate-800"
          />
          <circle cx="200" cy="200" r="150" fill="#F1F5F9" className="dark:fill-slate-700" />
          <circle
            cx="150"
            cy="180"
            r="15"
            fill="#94A3B8"
            className="dark:fill-slate-500 animate-pulse"
          />
          <circle
            cx="250"
            cy="180"
            r="15"
            fill="#94A3B8"
            className="dark:fill-slate-500 animate-pulse"
          />
          <path
            d="M170 240C170 240 180 230 200 230C220 230 230 240 230 240"
            stroke="#94A3B8"
            strokeWidth="8"
            strokeLinecap="round"
            className="dark:stroke-slate-500"
          />
          <text
            x="200"
            y="140"
            textAnchor="middle"
            fontSize="60"
            fontWeight="bold"
            fill="#3B82F6"
            className="font-sans"
          >
            404
          </text>
        </svg>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
        Lost in Space?
      </h1>

      <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md mb-8">
        The page you're looking for seems to have drifted away into the digital void.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20"
        >
          <Home size={20} className="mr-2" />
          Go Home
        </Link>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Go Back
        </button>
      </div>
    </div>
  );
};

export { NotFound };
