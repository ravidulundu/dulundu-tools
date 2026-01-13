import { Check, Copy, Loader2, Mail, Send, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

import { ActionButton } from '@/components/common/ActionButton';
import { CodeEditor } from '@/components/common/CodeEditor';
import { ToolHeader } from '@/components/common/ToolHeader';
import { ToolPageLayout } from '@/components/layouts/ToolPageLayout';
import { generateEmail } from '@/services/aiService';
import { EMAIL_TONE_OPTIONS } from '@/shared/aiConstants';

export const EmailGenerator: React.FC = () => {
  const [recipient, setRecipient] = useState('');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Professional');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    try {
      const result = await generateEmail(topic, recipient, tone);
      setOutput(result);
    } catch (error) {
      console.error('Failed to generate email:', error);
      const message =
        error instanceof Error ? error.message : 'Failed to generate email. Please try again.';
      setOutput(`Error: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setRecipient('');
    setTopic('');
    setOutput('');
  };

  return (
    <ToolPageLayout>
      <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Mail}
          title="AI Email Generator"
          description="Draft professional emails in seconds"
        />

        {/* Toolbar */}
        <div className="p-3 bg-card border-b border-border flex justify-between items-center flex-wrap gap-2">
          <div className="flex gap-2 items-center flex-1">
            <div className="flex items-center space-x-2 bg-background-secondary p-1 rounded-lg border border-border">
              <span className="text-xs font-medium text-foreground-muted pl-2">Tone:</span>
              <select
                value={tone}
                onChange={e => setTone(e.target.value)}
                className="bg-transparent text-sm font-medium text-foreground outline-none cursor-pointer p-1"
              >
                {EMAIL_TONE_OPTIONS.map(t => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors font-medium shadow-sm flex items-center text-sm"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin mr-1.5" />
              ) : (
                <Send size={16} className="mr-1.5" />
              )}
              Generate Email
            </button>
            <button
              onClick={handleClear}
              className="p-2 text-foreground-muted hover:text-danger hover:bg-danger-light rounded-lg transition-colors"
              title="Clear All"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-background-secondary/30">
          <div className="grid md:grid-cols-2 gap-4 h-full">
            {/* Input Section */}
            <div className="flex flex-col gap-4 h-full">
              <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
                <label
                  htmlFor="recipient-input"
                  className="block text-sm font-bold text-foreground-secondary mb-2"
                >
                  Recipient
                </label>
                <input
                  id="recipient-input"
                  type="text"
                  value={recipient}
                  onChange={e => setRecipient(e.target.value)}
                  placeholder="e.g. Hiring Manager, Team Lead, Client"
                  className="w-full p-2 bg-background-secondary border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                />
              </div>
              <div className="flex-1 flex flex-col">
                <CodeEditor
                  value={topic}
                  onChange={setTopic}
                  label="What is this email about?"
                  placeholder="e.g. Asking for a sick leave for tomorrow..."
                  theme="light"
                />
              </div>
            </div>

            {/* Output Section */}
            <CodeEditor
              value={output}
              label="Generated Draft"
              placeholder="Your email draft will appear here..."
              readOnly
              theme="dark"
              actions={
                output && (
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
