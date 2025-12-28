import React from 'react';

interface NavButtonProps {
  label: string;
  count?: number;
  isActive: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: 'sidebar' | 'pill';
}

export const NavButton: React.FC<NavButtonProps> = ({
  label,
  count,
  isActive,
  onClick,
  icon,
  variant = 'sidebar',
}) => {
  if (variant === 'pill') {
    return (
      <button
        onClick={onClick}
        className={`flex-shrink-0 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
          isActive
            ? 'bg-primary text-white shadow-lg shadow-primary/20'
            : 'bg-card text-foreground-secondary border border-border'
        }`}
      >
        {label}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
        isActive
          ? 'bg-primary text-white shadow-md shadow-primary/20'
          : 'text-foreground-secondary hover:bg-background-secondary'
      }`}
    >
      <span className="flex items-center">
        {icon && <span className="mr-2.5">{icon}</span>}
        {label}
      </span>
      {count !== undefined && (
        <span
          className={`text-xs px-1.5 py-0.5 rounded-md ${
            isActive
              ? 'bg-white/20 text-white'
              : 'bg-background-secondary text-foreground-secondary'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
};
