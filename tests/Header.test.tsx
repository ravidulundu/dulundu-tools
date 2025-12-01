import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "../components/Header";
import React from "react";
import { ThemeProvider } from "../contexts/ThemeContext";
import { BrowserRouter } from "react-router-dom";

describe("Header", () => {
  it("renders without crashing", () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <Header darkMode={false} toggleTheme={() => {}} />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
