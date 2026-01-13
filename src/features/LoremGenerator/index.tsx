import { Check, Copy, Download, FileText, RefreshCw } from 'lucide-react';
import React, { useState } from 'react';

import { ActionButton } from '@/components/common/ActionButton';
import { CodeEditor } from '@/components/common/CodeEditor';
import { ToolHeader } from '@/components/common/ToolHeader';
import { downloadContent } from '@/utils/downloadUtils';

const LOREM_TEXT = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
  'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.',
  'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
  'Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.',
];

export const LoremGenerator: React.FC = () => {
  const [paragraphs, setParagraphs] = useState(3);

  const [copied, setCopied] = useState(false);

  const [version, setVersion] = useState(0);

  const output = React.useMemo(() => {
    const result = [];
    for (let i = 0; i < paragraphs; i++) {
      // Use version to change the starting index or shuffle if desired,
      // but for now just keeping it simple as per original logic.
      // To make 'Regenerate' work, we could offset by version.
      const text = LOREM_TEXT[(i + version) % LOREM_TEXT.length];
      result.push(text);
    }
    return result.join('\n\n');
  }, [paragraphs, version]);

  const handleRegenerate = () => {
    setVersion(v => v + 1);
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={FileText}
          title="Lorem Ipsum Generator"
          description="Generate placeholder text for your designs"
        />

        {/* Toolbar */}
        <div className="p-3 bg-card border-b border-border flex justify-between items-center flex-wrap gap-2">
          <div className="flex-1 max-w-md flex items-center gap-4">
            <label className="text-sm font-medium text-foreground-secondary whitespace-nowrap">
              Paragraphs: {paragraphs}
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={paragraphs}
              onChange={e => setParagraphs(parseInt(e.target.value))}
              className="w-full h-2 bg-background-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
          <button
            onClick={handleRegenerate}
            className="px-4 py-2 bg-card border border-border text-foreground-secondary rounded-lg hover:bg-background-secondary transition-colors flex items-center font-medium shadow-sm text-sm"
          >
            <RefreshCw size={16} className="mr-2" />
            Regenerate
          </button>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-background-secondary/30">
          <CodeEditor
            value={output}
            label="Generated Text"
            readOnly
            theme="dark"
            actions={
              <>
                <ActionButton
                  icon={Download}
                  label="Download"
                  onClick={() => {
                    downloadContent(output, 'lorem-ipsum.txt');
                  }}
                  variant="secondary"
                />
                <ActionButton
                  icon={copied ? Check : Copy}
                  label={copied ? 'Copied' : 'Copy'}
                  onClick={handleCopy}
                  variant={copied ? 'success' : 'primary'}
                />
              </>
            }
          />
        </div>
      </div>
    </div>
  );
};
