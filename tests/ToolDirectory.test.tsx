import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ToolDirectory } from "../components/ToolDirectory";
import React from "react";
import { ThemeProvider } from "../contexts/ThemeContext";
import { BrowserRouter } from "react-router-dom";

describe("ToolDirectory", () => {
  it("renders without crashing", () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <ToolDirectory tools={[]} />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
