import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ToolGrid } from "../components/home/ToolGrid";
import React from "react";
import { ThemeProvider } from "../contexts/ThemeContext";
import { BrowserRouter } from "react-router-dom";

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
