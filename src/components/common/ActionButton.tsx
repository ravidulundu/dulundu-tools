import { LucideIcon } from 'lucide-react';
import React, { useMemo } from 'react';

import { formatShortcut } from '@/hooks/useKeyboardShortcuts';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  label?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md';
  shortcut?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  icon: Icon,
  label,
  variant = 'primary',
  size = 'sm',
  shortcut,
  className = '',
  ...props
}) => {
  const tooltipText = useMemo(() => {
    if (props.title) return props.title;
    if (!label && !shortcut) return undefined;

    const parts: string[] = [];
    if (label) parts.push(label);
    if (shortcut) parts.push(`(${formatShortcut(shortcut)})`);
    return parts.join(' ');
  }, [label, shortcut, props.title]);
  // Base classes for layout and interaction
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  // Size variants
  const sizeClasses = {
    sm: 'text-xs px-3 py-2 rounded-md',
    md: 'text-sm px-4 py-2.5 rounded-lg',
  };

  // Color variants using semantic theme colors
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary-hover focus:ring-primary shadow-sm',
    secondary:
      'bg-card text-foreground-secondary border border-border hover:bg-background-secondary focus:ring-secondary shadow-sm',
    success: 'bg-success text-white hover:opacity-90 focus:ring-success shadow-sm',
    danger:
      'bg-card text-danger border border-danger/30 hover:bg-danger-light focus:ring-danger shadow-sm',
    ghost:
      'bg-transparent text-foreground-secondary hover:bg-background-secondary hover:text-foreground focus:ring-secondary',
  };

  const formattedShortcut = shortcut ? formatShortcut(shortcut) : null;

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      title={tooltipText}
      {...props}
    >
      <Icon
        size={size === 'sm' ? 16 : 18}
        className={label ? (size === 'sm' ? 'mr-1.5' : 'mr-2') : ''}
      />
      {label}
      {formattedShortcut && (
        <kbd className="hidden sm:inline-flex ml-2 px-1.5 py-0.5 text-[10px] font-medium bg-black/10 dark:bg-white/10 rounded opacity-70">
          {formattedShortcut}
        </kbd>
      )}
    </button>
  );
};
