import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home } from 'lucide-react';
import { SEO } from '../components/SEO';

const NotFound: React.FC = () => {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
            <SEO
                title="Page Not Found"
                description="The page you are looking for does not exist."
            />

            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-full mb-6">
                <FileQuestion size={64} className="text-primary" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                404 - Page Not Found
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md mb-8">
                Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>

            <Link
                to="/"
                className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20"
            >
                <Home size={20} className="mr-2" />
                Back to Home
            </Link>
        </div>
    );
};

export default NotFound;
