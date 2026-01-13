import clsx from 'clsx';
import React from 'react';

interface ToolPageLayoutProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export const ToolPageLayout: React.FC<ToolPageLayoutProps> = ({
  children,
  className,
  fullWidth = false,
}) => {
  return (
    <div
      className={clsx(
        'max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col',
        fullWidth && 'max-w-none',
        className
      )}
    >
      {children}
    </div>
  );
};
