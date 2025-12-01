import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MegaMenu from "../components/MegaMenu";
import React from "react";
import { ThemeProvider } from "../contexts/ThemeContext";
import { BrowserRouter } from "react-router-dom";

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
