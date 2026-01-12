import { LucideIcon } from 'lucide-react';
import React from 'react';

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
    <div className="mb-6 bg-card p-6 rounded-2xl border border-border shadow-sm">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary-light rounded-xl border border-primary/20 shrink-0">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">{title}</h1>
            <p className="text-foreground-muted mt-1 text-sm leading-relaxed max-w-2xl">{description}</p>
          </div>
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </div>
  );
};
