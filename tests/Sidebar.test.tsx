import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Sidebar } from "../components/home/Sidebar";
import React from "react";
import { ThemeProvider } from "../contexts/ThemeContext";
import { BrowserRouter } from "react-router-dom";

describe("Sidebar", () => {
  it("renders without crashing", () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <Sidebar
            activeCategory="All"
            setActiveCategory={() => {}}
            sortedCategories={["Dev", "Design"]}
            categoryInfo={{
              Dev: { count: 1, path: "/dev" },
              Design: { count: 1, path: "/design" },
            }}
          />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
