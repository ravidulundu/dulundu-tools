import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ToolHeader } from "../components/common/ToolHeader";
import { Settings } from "lucide-react";
import React from "react";
import { ThemeProvider } from "../contexts/ThemeContext";
import { BrowserRouter } from "react-router-dom";

describe("ToolHeader", () => {
  it("renders without crashing", () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <ToolHeader
            title="Test Tool"
            description="Test Description"
            icon={Settings}
          />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
