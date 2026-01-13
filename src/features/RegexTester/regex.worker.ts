interface Match {
  index: number;
  value: string;
  groups: string[];
}

self.onmessage = (e: MessageEvent) => {
  const { pattern, flags, text } = e.data;

  // Hard limit on execution time inside worker (backup to main thread timeout)
  const WORKER_TIMEOUT_MS = 2000;
  const startTime = self.performance.now();

  try {
    const regex = new RegExp(pattern, flags);
    const matches: Match[] = [];

    // Global matching
    if (regex.global) {
      let match;
      // Safety break counter
      let iterations = 0;
      const MAX_ITERATIONS = 10000;

      while ((match = regex.exec(text)) !== null) {
        // Check timeout
        if (self.performance.now() - startTime > WORKER_TIMEOUT_MS) {
          throw new Error('Regex execution took too long (worker timeout)');
        }

        // Check iterations
        if (++iterations > MAX_ITERATIONS) {
          throw new Error(`Too many matches (limit ${MAX_ITERATIONS})`);
        }

        matches.push({
          index: match.index,
          value: match[0],
          groups: match.slice(1), // capture groups
        });

        // Prevent infinite loop with zero-width matches
        if (match.index === regex.lastIndex) {
          regex.lastIndex++;
        }
      }
    } else {
      // Single match
      const match = regex.exec(text);
      if (match) {
        matches.push({
          index: match.index,
          value: match[0],
          groups: match.slice(1),
        });
      }
    }

    self.postMessage({ matches, error: null });
  } catch (error) {
    self.postMessage({
      matches: [],
      error: error instanceof Error ? error.message : 'Unknown worker error',
    });
  }
};

export {};
