import React, { useState } from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  svgCode: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, svgCode }) => {
  const [shareStep, setShareStep] = useState<'SAVE' | 'SHARE'>('SAVE');
  const [shareUrl, setShareUrl] = useState('');
  const [svgName, setSvgName] = useState('Untitled SVG');
  const [isUrlCopied, setIsUrlCopied] = useState(false);
  const [expiration, setExpiration] = useState('7 Days');
  const [isSaving, setIsSaving] = useState(false);

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setShareStep('SAVE');
      setSvgName('Untitled SVG');
      setExpiration('7 Days');
      setIsSaving(false);
    }
  }, [isOpen]);

  const handleSaveAndShare = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: svgCode,
          type: 'svg',
          expiration: expiration, // Send selected expiration
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save share');
      }

      const data = await response.json();

      const origin =
        typeof window !== 'undefined' ? window.location.origin : 'https://dulundu.tools';

      const url = `${origin}/s/${data.id}`;
      setShareUrl(url);
      setShareStep('SHARE');
    } catch (error) {
      console.error('Error sharing SVG:', error);
      alert('Failed to create share link. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    setIsUrlCopied(true);
    setTimeout(() => setIsUrlCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-md overflow-hidden border border-border">
        {shareStep === 'SAVE' ? (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Save before you share it
              </h3>
              <button
                onClick={onClose}
                className="text-foreground-muted hover:text-foreground-secondary"
              >
                <span className="text-2xl leading-none">&times;</span>
              </button>
            </div>
            <p className="text-sm text-foreground-muted mb-4">
              Save SVG to access it later and share it with others
            </p>
            <input
              type="text"
              value={svgName}
              onChange={e => setSvgName(e.target.value)}
              className="w-full px-3 py-2 bg-background-secondary border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              placeholder="Untitled SVG"
            />
            <div className="flex items-center gap-4 mb-6">
              <label
                htmlFor="expiration-select"
                className="text-sm font-medium text-foreground-secondary"
              >
                Link expires
              </label>
              <select
                id="expiration-select"
                value={expiration}
                onChange={e => setExpiration(e.target.value)}
                className="flex-1 px-3 py-2 bg-background-secondary border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1 Hour">1 Hour</option>
                <option value="24 Hours">24 Hours</option>
                <option value="7 Days">7 Days</option>
                <option value="30 Days">30 Days</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-sm font-medium text-foreground-secondary bg-background-secondary hover:bg-background-tertiary rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAndShare}
                disabled={isSaving}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Share &quot;{svgName}&quot;
              </h3>
              <button
                onClick={onClose}
                className="text-foreground-muted hover:text-foreground-secondary"
              >
                <span className="text-2xl leading-none">&times;</span>
              </button>
            </div>
            <p className="text-sm text-foreground-muted mb-6">
              Anyone with the link below will be able to view and duplicate the file
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-3 py-2 bg-accent/10 border border-accent/30 rounded-md text-sm text-foreground focus:outline-none"
              />
              <button
                onClick={handleCopyUrl}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors min-w-[80px]"
              >
                {isUrlCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
