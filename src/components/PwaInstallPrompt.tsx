import { Download, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    // Check if dismissed recently (24h)
    const dismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissed && Date.now() - parseInt(dismissed) < 24 * 60 * 60 * 1000) {
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show after 30 seconds of usage
      setTimeout(() => setShowPrompt(true), 30000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  if (!showPrompt || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-scale-in">
      <div className="bg-card border border-border rounded-xl shadow-2xl p-4 max-w-sm">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 text-foreground-muted hover:text-foreground rounded-lg hover:bg-background-secondary transition-colors"
        >
          <X size={16} />
        </button>

        <div className="flex items-start gap-3 pr-4">
          <div className="p-2.5 bg-primary-light text-primary rounded-xl flex-shrink-0">
            <Download size={22} />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-sm">Install Dulundu Tools</h3>
            <p className="text-xs text-foreground-muted mt-1 leading-relaxed">
              Quick access & offline support
            </p>
            <button
              onClick={handleInstall}
              className="mt-3 px-4 py-1.5 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary-hover transition-colors"
            >
              Install
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
