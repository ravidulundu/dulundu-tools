import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ToolHeaderProps {
    icon: LucideIcon;
    title: string;
    description: string;
    iconBgColor?: string;
    iconColor?: string;
}

export const ToolHeader: React.FC<ToolHeaderProps> = ({
    icon: Icon,
    title,
    description,
    iconBgColor = 'bg-blue-100',
    iconColor = 'text-primary',
}) => {
    return (
        <div className="p-4 md:p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center space-x-3">
                <div className={`p-2 ${iconBgColor} ${iconColor} rounded-lg`}>
                    <Icon size={24} />
                </div>
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-slate-800">{title}</h1>
                    <p className="text-xs md:text-sm text-slate-500">{description}</p>
                </div>
            </div>
        </div>
    );
};
