import { Construction, ArrowLeft, Mail } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

export const ComingSoon: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center bg-gray-50">
      <div className="bg-white p-12 rounded-3xl shadow-lg border border-gray-200 max-w-2xl w-full flex flex-col items-center">
        <div className="p-6 bg-blue-50 text-primary rounded-full mb-8 animate-pulse">
          <Construction size={64} />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Under Construction</h1>
        <p className="text-lg text-slate-500 mb-10 leading-relaxed max-w-lg">
          We are currently working hard to bring this tool to life. It will be available in the next
          scheduled update.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link
            to="/"
            className="flex items-center justify-center space-x-2 px-8 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-medium shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            <ArrowLeft size={20} />
            <span>Back to Tools</span>
          </Link>
          <button className="flex items-center justify-center space-x-2 px-8 py-3 bg-white text-slate-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-medium hover:border-gray-400">
            <Mail size={20} />
            <span>Notify Me</span>
          </button>
        </div>
      </div>
    </div>
  );
};
