import { render, RenderOptions, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactElement, ReactNode } from 'react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import { ToolHistoryProvider } from '@/contexts/ToolHistoryContext';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn().mockResolvedValue(''),
  },
});

// Mock crypto API
Object.defineProperty(window, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-1234-5678-9abc-def012345678',
    getRandomValues: (arr: Uint32Array) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 4294967296);
      }
      return arr;
    },
    subtle: {
      digest: vi.fn().mockResolvedValue(new ArrayBuffer(32)),
    },
  },
});

// Mock scrollTo
window.scrollTo = vi.fn();

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

interface WrapperProps {
  children: ReactNode;
  initialRoute?: string;
}

// Wrapper with all providers
const AllProviders = ({ children, initialRoute = '/' }: WrapperProps) => {
  return (
    <MemoryRouter
      initialEntries={[initialRoute]}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ThemeProvider>
        <ToolHistoryProvider>{children}</ToolHistoryProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
};

// Custom render with providers
export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { initialRoute?: string }
) => {
  const { initialRoute, ...renderOptions } = options || {};

  return {
    user: userEvent.setup(),
    ...render(ui, {
      wrapper: ({ children }) => (
        <AllProviders initialRoute={initialRoute}>{children}</AllProviders>
      ),
      ...renderOptions,
    }),
  };
};

// Helper to find input by placeholder or label
export const findInput = async (placeholderOrLabel: string) => {
  return (
    screen.queryByPlaceholderText(placeholderOrLabel) ||
    screen.queryByLabelText(placeholderOrLabel) ||
    screen.queryByRole('textbox', { name: new RegExp(placeholderOrLabel, 'i') })
  );
};

// Helper to find textarea
export const findTextarea = async (placeholderOrLabel: string) => {
  return (
    screen.queryByPlaceholderText(placeholderOrLabel) ||
    screen.queryByRole('textbox', { name: new RegExp(placeholderOrLabel, 'i') })
  );
};

// Helper to find button by text
export const findButton = (text: string) => {
  return screen.queryByRole('button', { name: new RegExp(text, 'i') });
};

// Helper to test copy functionality
export const testCopyButton = async (buttonText: string = 'Copy') => {
  const copyButton = findButton(buttonText);
  if (copyButton) {
    await userEvent.click(copyButton);
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    return true;
  }
  return false;
};

// Helper to type in CodeMirror/Monaco editor
export const typeInEditor = async (
  container: HTMLElement,
  text: string,
  editorClass: string = '.cm-content'
) => {
  const editor = container.querySelector(editorClass);
  if (editor) {
    // Focus the editor
    fireEvent.focus(editor);
    // Type text
    await userEvent.type(editor as HTMLElement, text);
  }
};

// Helper to wait for element with text
export const waitForText = async (text: string, timeout = 3000) => {
  return waitFor(
    () => {
      expect(screen.getByText(new RegExp(text, 'i'))).toBeInTheDocument();
    },
    { timeout }
  );
};

// Helper to check if element exists
export const elementExists = (testId: string) => {
  return screen.queryByTestId(testId) !== null;
};

// Test factory for common tool patterns
export const createToolTest = (
  ToolComponent: React.ComponentType,
  toolName: string,
  options?: {
    hasInput?: boolean;
    hasOutput?: boolean;
    hasCopy?: boolean;
    hasClear?: boolean;
    hasDownload?: boolean;
    customTests?: () => void;
  }
) => {
  const { hasInput = true, hasOutput = true, hasCopy = true, hasClear = true, customTests } = options || {};

  describe(toolName, () => {
    it('renders without crashing', () => {
      renderWithProviders(<ToolComponent />);
      expect(document.body).toBeDefined();
    });

    it('displays tool header', () => {
      renderWithProviders(<ToolComponent />);
      // Most tools have their name in the header
      expect(screen.getByRole('heading')).toBeInTheDocument();
    });

    if (hasInput) {
      it('has input area', () => {
        const { container } = renderWithProviders(<ToolComponent />);
        const hasTextarea = container.querySelector('textarea') !== null;
        const hasInput = container.querySelector('input[type="text"]') !== null;
        const hasEditor = container.querySelector('.cm-editor, .monaco-editor') !== null;
        expect(hasTextarea || hasInput || hasEditor).toBe(true);
      });
    }

    if (hasCopy) {
      it('has copy button', () => {
        renderWithProviders(<ToolComponent />);
        const copyButton = findButton('Copy');
        expect(copyButton).toBeDefined();
      });
    }

    if (hasClear) {
      it('has clear button', () => {
        renderWithProviders(<ToolComponent />);
        const clearButton = findButton('Clear');
        expect(clearButton).toBeDefined();
      });
    }

    if (customTests) {
      customTests();
    }
  });
};

// Re-export testing library utilities
export { screen, waitFor, fireEvent, userEvent };
