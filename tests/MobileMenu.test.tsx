import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MobileMenu from "../components/MobileMenu";
import React from "react";
import { ThemeProvider } from "../contexts/ThemeContext";
import { BrowserRouter } from "react-router-dom";

describe("MobileMenu", () => {
  it("renders without crashing", () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <MobileMenu
            onClose={() => {}}
            navLinks={[{ name: "Home", path: "/" }]}
          />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
