import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CategoryCard } from "../components/CategoryCard";
import React from "react";
import { ThemeProvider } from "../contexts/ThemeContext";
import { BrowserRouter } from "react-router-dom";

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
