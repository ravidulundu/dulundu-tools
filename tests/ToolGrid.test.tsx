import { render } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";

import { ToolGrid } from "../components/home/ToolGrid";
import { ThemeProvider } from "../contexts/ThemeContext";


describe("ToolGrid", () => {
  it("renders without crashing", () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <ToolGrid
            isDirectoryView={true}
            popularTools={[]}
            activeCategory="All"
            filteredTools={[]}
            searchTerm=""
            setSearchTerm={() => {}}
            setSearchParams={() => {}}
            setActiveCategory={() => {}}
          />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
