import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ToolCard } from "../components/ToolCard";
import { Settings } from "lucide-react";
import { ToolCategory } from "../types";
import React from "react";
import { ThemeProvider } from "../contexts/ThemeContext";
import { BrowserRouter } from "react-router-dom";

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
