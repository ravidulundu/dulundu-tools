import { render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";

import MegaMenu from "../components/MegaMenu";
import { ThemeProvider } from "../contexts/ThemeContext";


describe("MegaMenu", () => {
  it("renders without crashing", () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <MegaMenu isOpen={true} onClose={() => {}} />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
