import { render } from "@testing-library/react";
import { Settings } from "lucide-react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";

import { ToolCard } from "../components/ToolCard";
import { ThemeProvider } from "../contexts/ThemeContext";
import { ToolCategory } from "../types";

describe("ToolCard", () => {
  it("renders without crashing", () => {
    const mockTool = {
      id: "test-tool",
      name: "Test Tool",
      description: "Test description",
      path: "/test",
      icon: Settings,
      category: ToolCategory.FORMATTER,
    };

    render(
      <BrowserRouter>
        <ThemeProvider>
          <ToolCard tool={mockTool} />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
