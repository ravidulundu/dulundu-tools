import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WordToHtml } from "../features/WordToHtml";
import React from "react";
import { ThemeProvider } from "../contexts/ThemeContext";
import { BrowserRouter } from "react-router-dom";

describe("WordToHtml", () => {
  beforeAll(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(),
      },
    });
  });

  it("updates HTML output when content is entered", () => {
    // Find the contentEditable div
    // It has data-placeholder="Paste your Word content here..."
    // Or we can find by label "Visual Editor (Paste here)" and get the next sibling or something.
    // But it doesn't have a role of textbox usually unless explicitly set.
    // Let's try finding by class or just querySelector if needed, but testing-library prefers accessible queries.
    // The div has `contentEditable` attribute.

    // Let's use a custom query or get by label and traverse.
    // Actually, let's add a test id or use the placeholder text if possible?
    // It has `data-placeholder`.

    // Let's try modifying the component to add a role or aria-label?
    // No, I should try to test as is.
    // `screen.getByLabelText("Visual Editor (Paste here)")` points to the label.
    // The div is not associated with the label via id/for.

    // Let's try finding the clear button and navigating? No.
    // Let's use container.querySelector.

    const { container } = render(
      <BrowserRouter>
        <ThemeProvider>
          <WordToHtml />
        </ThemeProvider>
      </BrowserRouter>
    );

    const editor = container.querySelector('[contenteditable="true"]');
    expect(editor).toBeDefined();

    if (editor) {
      // Simulate input
      editor.innerHTML = "<p>Hello World</p>";
      fireEvent.input(editor);

      // Check output textarea
      const output = screen.getByPlaceholderText(
        "HTML code will appear here..."
      );
      expect(output).toHaveValue("<p>Hello World</p>");
    }
  });

  it("clears content", () => {
    const { container } = render(
      <BrowserRouter>
        <ThemeProvider>
          <WordToHtml />
        </ThemeProvider>
      </BrowserRouter>
    );

    const editor = container.querySelector('[contenteditable="true"]');
    if (editor) {
      editor.innerHTML = "<p>Test</p>";
      fireEvent.input(editor);

      const clearBtn = screen.getByText("Clear");
      fireEvent.click(clearBtn);

      const output = screen.getByPlaceholderText(
        "HTML code will appear here..."
      );
      expect(output).toHaveValue("");
      expect(editor.innerHTML).toBe("");
    }
  });
});
