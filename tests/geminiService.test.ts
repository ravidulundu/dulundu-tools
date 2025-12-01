import { generateCodeHelp, paraphraseText } from '../services/geminiService';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('geminiService', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch);
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  describe('generateCodeHelp', () => {
    it('should return generated code on success', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ text: 'generated code' }),
      });

      const result = await generateCodeHelp('test prompt');
      expect(result).toBe('generated code');
      expect(mockFetch).toHaveBeenCalledWith('/api/ai/generate', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ prompt: 'test prompt', language: 'javascript' }),
      }));
    });

    it('should handle API error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'API Error' }),
      });

      const result = await generateCodeHelp('test prompt');
      expect(result).toContain('Error: API Error');
    });

    it('should handle network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network Error'));

      const result = await generateCodeHelp('test prompt');
      expect(result).toContain('Error: Network Error');
    });

    it('should block requests if rate limit exceeded', async () => {
      // Simulate exceeding rate limit
      // BURST_LIMIT is 5
      for (let i = 0; i < 6; i++) {
        mockFetch.mockResolvedValue({
          ok: true,
          json: async () => ({ text: 'code' }),
        });
        await generateCodeHelp('prompt');
      }

      const result = await generateCodeHelp('prompt');
      expect(result).toContain('Abuse detected');
    });
  });

  describe('paraphraseText', () => {
    it('should return paraphrased text on success', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ text: 'paraphrased text' }),
      });

      const result = await paraphraseText('original text');
      expect(result).toBe('paraphrased text');
      expect(mockFetch).toHaveBeenCalledWith('/api/ai/paraphrase', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ text: 'original text', tone: 'professional' }),
      }));
    });

    it('should handle API error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'API Error' }),
      });

      const result = await paraphraseText('text');
      expect(result).toContain('Error: API Error');
    });
  });
});
