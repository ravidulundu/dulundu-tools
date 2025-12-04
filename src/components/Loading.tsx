import React from 'react';

export const Loading: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200 pb-20">
      {/* Hero Skeleton */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 relative overflow-hidden z-20 transition-colors duration-200">
        <div className="container mx-auto px-4 py-16 text-center max-w-4xl relative z-10">
          {/* Badge Skeleton */}
          <div className="inline-flex items-center justify-center w-48 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-8 mx-auto animate-pulse"></div>

          {/* Title Skeleton */}
          <div className="h-16 md:h-20 bg-slate-200 dark:bg-slate-800 rounded-lg max-w-2xl mx-auto mb-6 animate-pulse"></div>

          {/* Description Skeleton */}
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg max-w-xl mx-auto mb-12 animate-pulse"></div>

          {/* Search Bar Skeleton */}
          <div className="relative max-w-2xl mx-auto">
            <div className="h-20 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar Skeleton */}
          <aside className="hidden lg:block w-64 shrink-0 space-y-4">
            <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-4"></div>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div
                key={i}
                className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse"
              ></div>
            ))}
          </aside>

          {/* Main Grid Skeleton */}
          <main className="flex-1 w-full">
            <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg mb-6 animate-pulse"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div
                  key={i}
                  className="h-32 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 animate-pulse"
                ></div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
