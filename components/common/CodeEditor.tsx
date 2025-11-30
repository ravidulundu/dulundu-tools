import React from 'react';

interface CodeEditorProps {
    value: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    label?: React.ReactNode;
    readOnly?: boolean;
    theme?: 'light' | 'dark';
    actions?: React.ReactNode;
    language?: string;
    className?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
    value,
    onChange,
    placeholder = 'Enter text here...',
    label,
    readOnly = false,
    theme = readOnly ? 'dark' : 'light',
    actions,
    language,
    className,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (onChange) {
            onChange(e.target.value);
        }
    };

    const themeClasses = theme === 'dark'
        ? 'border-gray-800 bg-[#1e293b] text-gray-50'
        : 'border-gray-300 bg-white text-slate-900 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary';

    return (
        <div className="flex flex-col h-full min-h-[300px]">
            {(label || actions) && (
                <div className="flex justify-between items-center mb-2">
                    {label && (
                        <label className="block text-sm font-bold text-slate-700">{label}</label>
                    )}
                    {actions && <div className="flex gap-2">{actions}</div>}
                </div>
            )}
            <div className={`flex-1 relative rounded-xl border transition-all overflow-hidden ${theme === 'dark' ? 'shadow-md' : 'shadow-inner'} ${themeClasses}`}>
                <textarea
                    value={value}
                    onChange={handleChange}
                    readOnly={readOnly}
                    placeholder={placeholder}
                    className={`w-full h-full p-4 font-mono text-sm outline-none resize-none leading-relaxed ${theme === 'dark' ? 'bg-[#1e293b] text-gray-50 selection:bg-blue-500/30' : 'bg-white text-slate-900'}`}
                />
            </div>
        </div>
    );
};
