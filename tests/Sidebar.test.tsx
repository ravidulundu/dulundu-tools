import { render } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";

import { Sidebar } from "../components/home/Sidebar";
import { ThemeProvider } from "../contexts/ThemeContext";


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
