import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loading: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-lg mb-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Loading tool...</p>
        </div>
    );
};
