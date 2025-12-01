import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ReadmeGenerator } from "../features/ReadmeGenerator/ReadmeGenerator";
import React from "react";

import { ThemeProvider } from "../contexts/ThemeContext";

describe("ReadmeGenerator", () => {
  beforeAll(() => {
    // Mock URL.createObjectURL and URL.revokeObjectURL
    global.URL.createObjectURL = vi.fn();
    global.URL.revokeObjectURL = vi.fn();

    // Mock navigator.clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(),
      },
    });
  });

  it("renders correctly", () => {
    render(
      <ThemeProvider>
        <ReadmeGenerator />
      </ThemeProvider>
    );
    expect(screen.getByText("Markdown Editor")).toBeDefined();
    expect(screen.getByText("Custom Section")).toBeDefined();
    expect(screen.getByText("Reset / Clear All")).toBeDefined();
  });

  it("toggles section inclusion", async () => {
    render(
      <ThemeProvider>
        <ReadmeGenerator />
      </ThemeProvider>
    );

    // Find a section, e.g., "Title and Description"
    const sectionName = "Title and Description";
    const sectionItem = screen.getByText(sectionName);

    // Click to toggle (enable)
    fireEvent.click(sectionItem);

    // Check if it appears in the preview (PreviewAndRaw renders the HTML)
    // We can switch to Raw tab to check the markdown content easily
    const rawTab = screen.getByText("Raw");
    fireEvent.click(rawTab);

    const headings = screen.getAllByText(/# Project Title/);
    expect(headings.length).toBeGreaterThan(0);
  });

  it("adds a custom section", async () => {
    render(
      <ThemeProvider>
        <ReadmeGenerator />
      </ThemeProvider>
    );

    const addCustomBtn = screen.getByText("Custom Section");
    fireEvent.click(addCustomBtn);

    // Switch to Raw tab
    const rawTab = screen.getByText("Raw");
    fireEvent.click(rawTab);

    const customHeadings = screen.getAllByText(/## Custom Section/);
    expect(customHeadings.length).toBeGreaterThan(0);

    const customContent = screen.getAllByText(/Add your content here/);
    expect(customContent.length).toBeGreaterThan(0);
  });

  it("resets all sections", async () => {
    render(
      <ThemeProvider>
        <ReadmeGenerator />
      </ThemeProvider>
    );

    // Enable a section
    const sectionName = "Title and Description";
    fireEvent.click(screen.getByText(sectionName));

    // Click Reset
    const resetBtn = screen.getByText("Reset / Clear All");
    fireEvent.click(resetBtn);

    // Modal should appear
    expect(screen.getByText("Reset All Sections")).toBeDefined();

    // Confirm reset
    const confirmBtn = screen.getByText("Confirm");
    fireEvent.click(confirmBtn);

    // Check if content is cleared
    const rawTab = screen.getByText("Raw");
    fireEvent.click(rawTab);

    // This text should appear in the Raw view when empty
    const emptyMsg = screen.getAllByText(/# No sections selected/);
    expect(emptyMsg.length).toBeGreaterThan(0);
  });
});
