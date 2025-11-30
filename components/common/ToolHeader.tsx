import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ToolHeaderProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actions?: React.ReactNode;
    iconBgColor?: string;
    iconColor?: string;
}

export const ToolHeader: React.FC<ToolHeaderProps> = ({
    icon: Icon,
    title,
    description,
    actions,
}) => {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                        <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
                </div>
                {actions && <div>{actions}</div>}
            </div>
            <p className="text-slate-500 ml-[60px]">{description}</p>
        </div>
    );
};
