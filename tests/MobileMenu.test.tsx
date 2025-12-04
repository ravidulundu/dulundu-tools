import { render } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";

import MobileMenu from "../components/MobileMenu";
import { ThemeProvider } from "../contexts/ThemeContext";


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
