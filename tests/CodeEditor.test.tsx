import { render } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";

import { CodeEditor } from "../components/common/CodeEditor";
import { ThemeProvider } from "../contexts/ThemeContext";


describe("CodeEditor", () => {
  it("renders without crashing", () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <CodeEditor value="" onChange={() => {}} />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
