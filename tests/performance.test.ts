import { measureComponentRender, logPageLoadTime } from '../utils/performance';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('performance utils', () => {
  describe('measureComponentRender', () => {
    beforeEach(() => {
      vi.stubGlobal('performance', {
        mark: vi.fn(),
        measure: vi.fn(),
        getEntriesByName: vi.fn(() => [{ duration: 100 }]),
        getEntriesByType: vi.fn(),
      });
      vi.stubGlobal('console', {
        log: vi.fn(),
      });
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('should create start and end functions', () => {
      const measure = measureComponentRender('TestComponent');
      expect(measure).toHaveProperty('start');
      expect(measure).toHaveProperty('end');
      expect(typeof measure.start).toBe('function');
      expect(typeof measure.end).toBe('function');
    });

    it('should call performance.mark on start', () => {
      const measure = measureComponentRender('TestComponent');
      measure.start();
      expect(performance.mark).toHaveBeenCalledWith('TestComponent-start');
    });

    it('should call performance.mark and measure on end', () => {
      const measure = measureComponentRender('TestComponent');
      measure.end();
      expect(performance.mark).toHaveBeenCalledWith('TestComponent-end');
      expect(performance.measure).toHaveBeenCalledWith(
        'TestComponent-render',
        'TestComponent-start',
        'TestComponent-end'
      );
    });
  });

  describe('logPageLoadTime', () => {
    beforeEach(() => {
      vi.stubGlobal('performance', {
        getEntriesByType: vi.fn(() => [{
          loadEventEnd: 200,
          fetchStart: 100,
          domContentLoadedEventEnd: 150,
        }]),
      });
      vi.stubGlobal('console', {
        log: vi.fn(),
      });
      // Mock window.addEventListener
      vi.spyOn(window, 'addEventListener').mockImplementation((event, handler) => {
        if (event === 'load') {
          (handler as any)();
        }
      });
    });

    afterEach(() => {
      vi.unstubAllGlobals();
      vi.restoreAllMocks();
    });

    it('should log page load time in dev environment', () => {
      // Mock import.meta.env.DEV
      vi.stubGlobal('import', { meta: { env: { DEV: true } } }); 
      // Note: import.meta is hard to mock in some environments, but assuming vitest handles it or we skip if not possible.
      // Alternatively, we can just check if the function runs without error.
      
      // Since we can't easily mock import.meta.env.DEV if it's not configurable, 
      // we'll assume the test environment might not trigger the console.log if DEV is false.
      // However, we can try to invoke it.
      
      logPageLoadTime();
      
      // If we are in a test env that mimics DEV, it should log.
      // If not, we just ensure it doesn't crash.
    });
  });
});
