import React from "react";
import { LucideIcon } from "lucide-react";

interface ActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  label?: string;
  variant?: "primary" | "secondary" | "success" | "danger" | "ghost";
  size?: "sm" | "md";
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  icon: Icon,
  label,
  variant = "primary",
  size = "sm",
  className = "",
  ...props
}) => {
  // Base classes for layout and interaction
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  // Size variants
  const sizeClasses = {
    sm: "text-xs px-3 py-2 rounded-md",
    md: "text-sm px-4 py-2.5 rounded-lg",
  };

  // Color variants (Tailwind v3 compatible)
  const variantClasses = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm",
    secondary:
      "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-slate-500 shadow-sm",
    success:
      "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 shadow-sm",
    danger:
      "bg-white text-red-600 border border-red-200 hover:bg-red-50 focus:ring-red-500 shadow-sm",
    ghost:
      "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-500",
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      title={props.title || label}
      {...props}
    >
      <Icon
        size={size === "sm" ? 16 : 18}
        className={label ? (size === "sm" ? "mr-1.5" : "mr-2") : ""}
      />
      {label}
    </button>
  );
};
