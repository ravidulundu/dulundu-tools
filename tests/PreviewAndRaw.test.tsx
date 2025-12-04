import { render } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";

import { ThemeProvider } from "../contexts/ThemeContext";
import { PreviewAndRaw } from "../features/ReadmeGenerator/components/PreviewAndRaw";

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
