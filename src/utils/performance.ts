/**
 * Performance monitoring utilities for Dulundu.tools
 * Tracks Core Web Vitals and provides performance metrics
 */

export interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}

/**
 * Simple performance marker for measuring component render times
 */
export const measureComponentRender = (componentName: string) => {
  if (typeof window !== 'undefined' && window.performance) {
    const startMark = `${componentName}-start`;
    const endMark = `${componentName}-end`;
    const measureName = `${componentName}-render`;

    return {
      start: () => performance.mark(startMark),
      end: () => {
        performance.mark(endMark);
        try {
          performance.measure(measureName, startMark, endMark);
          const measure = performance.getEntriesByName(measureName)[0];
          if (import.meta.env.DEV) {
            console.log(
              `[Performance] ${componentName} rendered in ${measure.duration.toFixed(2)}ms`
            );
          }
        } catch (e) {
          // Silently fail if marks don't exist
        }
      },
    };
  }
  return { start: () => {}, end: () => {} };
};

/**
 * Log page load performance in development
 */
export const logPageLoadTime = () => {
  if (import.meta.env.DEV && typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;
      if (navigation) {
        const pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
        console.log(`[Performance] Page load time: ${pageLoadTime.toFixed(2)}ms`);
        console.log(
          `[Performance] DOM Content Loaded: ${(navigation.domContentLoadedEventEnd - navigation.fetchStart).toFixed(2)}ms`
        );
      }
    });
  }
};
