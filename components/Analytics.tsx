import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const Analytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Only use environment variables - no hardcoded fallbacks
    const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID;
    const scriptUrl = import.meta.env.VITE_UMAMI_SCRIPT_URL;

    // Only load if both env vars are configured
    if (websiteId && scriptUrl && !document.getElementById("umami-script")) {
      const script = document.createElement("script");
      script.id = "umami-script";
      script.async = true;
      script.defer = true;
      script.src = scriptUrl;
      script.setAttribute("data-website-id", websiteId);

      // Auto-track handles initial load, but we might need manual for SPA transitions
      script.setAttribute("data-auto-track", "true");

      document.head.appendChild(script);
    }
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (window.umami) {
      // Manually track page view with new URL
      window.umami.track((props: any) => ({
        ...props,
        url: location.pathname,
      }));
    }
  }, [location]);

  return null;
};
