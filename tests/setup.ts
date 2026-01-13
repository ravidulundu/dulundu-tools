import '@testing-library/jest-dom';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // Deprecated
    removeListener: () => {}, // Deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock Worker for RegexTester
class WorkerMock {
  url: string;
  onmessage: ((this: Worker, ev: MessageEvent) => void) | null = null;
  onerror: ((this: AbstractWorker, ev: ErrorEvent) => void) | null = null;

  constructor(stringUrl: string) {
    this.url = stringUrl;
  }

  postMessage(_msg: unknown) {
    // Basic echo for testing or just silence
    // In a real test, we might want to mock the response
    // For now, checking instantiation is enough to pass the "crash" test
  }

  terminate() {}
  addEventListener() {}
  removeEventListener() {}
  dispatchEvent(): boolean {
    return true;
  }
}

Object.defineProperty(window, 'Worker', {
  writable: true,
  value: WorkerMock,
});
