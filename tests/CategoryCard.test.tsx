import { render } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";

import { CategoryCard } from "../components/CategoryCard";
import { ThemeProvider } from "../contexts/ThemeContext";


describe("CategoryCard", () => {
  it("renders without crashing", () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <CategoryCard
            category="Test Category"
            toolCount={5}
            onClick={() => {}}
          />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
