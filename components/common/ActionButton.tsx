import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
    icon: LucideIcon;
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'success' | 'danger';
    size?: 'sm' | 'md';
    disabled?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
    icon: Icon,
    label,
    onClick,
    variant = 'primary',
    size = 'sm',
    disabled = false,
}) => {
    const baseClasses = 'flex items-center rounded transition-colors font-medium border';

    const sizeClasses = size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-4 py-2';

    const variantClasses = {
        primary: 'bg-white text-primary border-primary/20 hover:bg-blue-50',
        secondary: 'bg-white border-gray-200 text-slate-600 hover:bg-gray-50',
        success: 'bg-green-50 text-green-700 border-green-200',
        danger: 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100',
    };

    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${sizeClasses} ${variantClasses[variant]} ${disabledClasses}`}
            title={label}
        >
            <Icon size={size === 'sm' ? 12 : 16} className="mr-1" />
            {label}
        </button>
    );
};
