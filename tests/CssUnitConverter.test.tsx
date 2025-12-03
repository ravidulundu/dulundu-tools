import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, it, expect } from "vitest";

import { CssUnitConverter } from "../features/CssUnitConverter";


describe("CssUnitConverter", () => {
  it("renders correctly", () => {
    render(<CssUnitConverter />);
    expect(screen.getByText("CSS Unit Converter")).toBeDefined();
  });
});
