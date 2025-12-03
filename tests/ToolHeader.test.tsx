import { render, screen } from "@testing-library/react";
import { Settings } from "lucide-react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";

import { ToolHeader } from "../components/common/ToolHeader";
import { ThemeProvider } from "../contexts/ThemeContext";

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
