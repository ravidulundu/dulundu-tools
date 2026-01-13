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
            className="fill-background-secondary"
          />
          <circle cx="200" cy="200" r="150" className="fill-background-tertiary" />
          <circle cx="150" cy="180" r="15" className="fill-foreground-muted animate-pulse" />
          <circle cx="250" cy="180" r="15" className="fill-foreground-muted animate-pulse" />
          <path
            d="M170 240C170 240 180 230 200 230C220 230 230 240 230 240"
            strokeWidth="8"
            strokeLinecap="round"
            className="stroke-foreground-muted"
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
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Lost in Space?</h1>
      The page you&apos;re looking for seems to have drifted away into the digital void.
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20"
        >
          <Home size={20} className="mr-2" />
          Go Home
        </Link>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center justify-center px-6 py-3 bg-card text-foreground-secondary font-semibold rounded-xl border border-border hover:bg-background-secondary transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Go Back
        </button>
      </div>
    </div>
  );
};

export { NotFound };
