import { Share2, Copy, Check, Trash2, ExternalLink } from 'lucide-react';
import React, { useState } from 'react';

import { ActionButton } from '@/components/common/ActionButton';
import { CodeEditor } from '@/components/common/CodeEditor';
import { ToolHeader } from '@/components/common/ToolHeader';

export const SharelinkGenerator: React.FC = () => {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [platform, setPlatform] = useState('twitter');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  const generateLink = () => {
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);

    let link = '';

    switch (platform) {
      case 'twitter':
        link = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
        break;
      case 'facebook':
        link = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'linkedin':
        link = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'whatsapp':
        link = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'telegram':
        link = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
        break;
      case 'reddit':
        link = `https://reddit.com/submit?url=${encodedUrl}&title=${encodedText}`;
        break;
      case 'email':
        link = `mailto:?subject=${encodedText}&body=${encodedUrl}`;
        break;
    }

    setGeneratedLink(link);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setUrl('');
    setText('');
    setGeneratedLink('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Share2}
          title="Share Link Generator"
          description="Create custom share links for social media"
        />

        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-background-secondary/30">
          <div className="grid md:grid-cols-2 gap-6 h-full">
            {/* Input Area */}
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm h-fit overflow-y-auto max-h-full">
              <div className="space-y-6">
                <div>
                  <span className="block text-sm font-bold text-foreground-secondary mb-2">Platform</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      'twitter',
                      'facebook',
                      'linkedin',
                      'whatsapp',
                      'telegram',
                      'reddit',
                      'email',
                    ].map(p => (
                      <button
                        key={p}
                        onClick={() => {
                          setPlatform(p);
                          setGeneratedLink('');
                        }}
                        className={`px-3 py-2 rounded-lg text-xs font-bold capitalize transition-all border ${
                          platform === p
                            ? 'bg-primary text-white border-primary shadow-md'
                            : 'bg-background-secondary text-foreground-secondary border-border hover:border-primary hover:bg-card'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="url-input" className="block text-sm font-bold text-foreground-secondary">
                      URL to Share
                    </label>
                    <button
                      onClick={handleClear}
                      className="text-xs text-red-500 hover:text-red-600 flex items-center"
                    >
                      <Trash2 size={12} className="mr-1" /> Clear
                    </button>
                  </div>
                  <input
                    id="url-input"
                    type="text"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    className="w-full p-3 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-foreground bg-background-secondary"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message-input"
                    className="block text-sm font-bold text-foreground-secondary mb-2"
                  >
                    Message / Title (Optional)
                  </label>
                  <textarea
                    id="message-input"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    className="w-full p-3 h-24 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none text-foreground bg-background-secondary"
                    placeholder="Check this out!"
                  />
                </div>

                <button
                  onClick={generateLink}
                  className="w-full py-3 bg-primary text-white rounded-xl hover:bg-blue-600 transition-colors font-bold shadow-md flex items-center justify-center"
                >
                  <Share2 size={18} className="mr-2" /> Generate Link
                </button>
              </div>
            </div>

            {/* Output Area */}
            <div className="flex flex-col h-full">
              <CodeEditor
                value={generatedLink}
                label="Generated Link"
                placeholder="Your share link will appear here..."
                readOnly
                theme="dark"
                actions={
                  generatedLink && (
                    <>
                      <ActionButton
                        icon={ExternalLink}
                        label="Test Link"
                        onClick={() => window.open(generatedLink, '_blank')}
                        variant="secondary"
                      />
                      <ActionButton
                        icon={copied ? Check : Copy}
                        label={copied ? 'Copied' : 'Copy'}
                        onClick={handleCopy}
                        variant={copied ? 'success' : 'primary'}
                      />
                    </>
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
