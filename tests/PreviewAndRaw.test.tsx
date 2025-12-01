import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PreviewAndRaw } from "../features/ReadmeGenerator/components/PreviewAndRaw";
import React from "react";
import { ThemeProvider } from "../contexts/ThemeContext";
import { BrowserRouter } from "react-router-dom";

describe("PreviewAndRaw", () => {
  it("renders without crashing", () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <PreviewAndRaw markdown="# Hello" />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
