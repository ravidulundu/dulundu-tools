import { Link, Copy, Check, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

import { ActionButton } from '@/components/common/ActionButton';
import { CodeEditor } from '@/components/common/CodeEditor';
import { ToolHeader } from '@/components/common/ToolHeader';
import { ToolPageLayout } from '@/components/layouts/ToolPageLayout';

export const SlugGenerator: React.FC = () => {
  const [input, setInput] = useState('Hello World! This is a Title.');
  const [slug, setSlug] = useState('');
  const [copied, setCopied] = useState(false);

  const generateSlug = (val: string) => {
    const res = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(res);
  };

  React.useEffect(() => {
    generateSlug(input);
  }, [input]);

  const handleCopy = () => {
    navigator.clipboard.writeText(slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setSlug('');
    setCopied(false);
  };

  return (
    <ToolPageLayout>
      <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Link}
          title="Slug Generator"
          description="Create SEO-friendly URL slugs"
          iconBgColor="bg-success-light"
          iconColor="text-success"
        />

        {/* Toolbar */}
        <div className="p-3 bg-card border-b border-border flex justify-end items-center">
          <button
            onClick={handleClear}
            className="p-2 text-foreground-muted hover:text-danger hover:bg-danger-light rounded-lg transition-colors"
            title="Clear All"
          >
            <Trash2 size={20} />
          </button>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-background-secondary/30">
          <div className="grid md:grid-cols-2 gap-4 h-full">
            <CodeEditor
              value={input}
              onChange={setInput}
              label="Input String"
              placeholder="e.g. My New Blog Post"
              theme="light"
            />

            <CodeEditor
              value={slug}
              label="Generated Slug"
              placeholder="slug-will-appear-here"
              readOnly
              theme="dark"
              actions={
                slug && (
                  <ActionButton
                    icon={copied ? Check : Copy}
                    label={copied ? 'Copied' : 'Copy'}
                    onClick={handleCopy}
                    variant={copied ? 'success' : 'primary'}
                  />
                )
              }
            />
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
};
