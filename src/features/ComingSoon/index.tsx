import { Construction, ArrowLeft, Mail } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

export const ComingSoon: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center bg-background-secondary">
      <div className="bg-card p-12 rounded-3xl shadow-lg border border-border max-w-2xl w-full flex flex-col items-center">
        <div className="p-6 bg-primary-light text-primary rounded-full mb-8 animate-pulse">
          <Construction size={64} />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">Under Construction</h1>
        <p className="text-lg text-foreground-muted mb-10 leading-relaxed max-w-lg">
          We are currently working hard to bring this tool to life. It will be available in the next
          scheduled update.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link
            to="/"
            className="flex items-center justify-center space-x-2 px-8 py-3 bg-foreground text-background rounded-xl hover:bg-foreground-secondary transition-all font-medium shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            <ArrowLeft size={20} />
            <span>Back to Tools</span>
          </Link>
          <button className="flex items-center justify-center space-x-2 px-8 py-3 bg-card text-foreground-secondary border border-border rounded-xl hover:bg-background-secondary transition-all font-medium hover:border-border">
            <Mail size={20} />
            <span>Notify Me</span>
          </button>
        </div>
      </div>
    </div>
  );
};
