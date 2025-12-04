/**
 * Event tracking utility for Umami Analytics
 * Uses existing window.umami type from src/types.d.ts
 */

export const trackEvent = (event: string, data?: Record<string, unknown>) => {
  try {
    if (window.umami) {
      window.umami.track(event, data);
    }
  } catch (_error) {
    // Silently fail - don't break user experience if analytics fail
  }
};

// Predefined event trackers for common actions
export const analytics = {
  // Tool usage tracking
  toolUsed: (toolId: string, toolName: string) => {
    trackEvent('tool-used', { toolId, toolName });
  },

  // Donation tracking
  donationClick: (platform: string) => {
    trackEvent('donation-click', { platform });
  },

  // Action tracking
  copyToClipboard: (toolId: string) => {
    trackEvent('copy-action', { toolId });
  },

  downloadFile: (fileType: string, toolId: string) => {
    trackEvent('download-action', { fileType, toolId });
  },

  // Search tracking
  searchPerformed: (query: string, resultsCount: number) => {
    trackEvent('search', { query: query.substring(0, 50), resultsCount });
  },

  // Category navigation
  categorySelected: (category: string) => {
    trackEvent('category-selected', { category });
  },

  // AI Assistant usage
  aiPromptSubmitted: (promptLength: number, language?: string) => {
    trackEvent('ai-prompt', { promptLength, language });
  },

  aiResponseReceived: (success: boolean, responseLength?: number) => {
    trackEvent('ai-response', { success, responseLength });
  },

  // Extension usage
  extensionToolOpened: (toolId: string) => {
    trackEvent('extension-tool-opened', { toolId });
  },

  // Error tracking
  errorOccurred: (errorType: string, toolId?: string) => {
    trackEvent('error', { errorType, toolId });
  },
};
