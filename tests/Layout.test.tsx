import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Layout } from "../components/Layout";
import React from "react";
import { ThemeProvider } from "../contexts/ThemeContext";
import { BrowserRouter } from "react-router-dom";

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
