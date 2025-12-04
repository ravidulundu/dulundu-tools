import { render } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";

import { Layout } from "../components/Layout";
import { ThemeProvider } from "../contexts/ThemeContext";


describe("Layout", () => {
  it("renders without crashing", () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <Layout>
            <div>Test Content</div>
          </Layout>
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
