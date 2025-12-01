import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CssUnitConverter } from "../features/CssUnitConverter";
import React from "react";

describe("CssUnitConverter", () => {
  it("renders correctly", () => {
    render(<CssUnitConverter />);
    expect(screen.getByText("CSS Unit Converter")).toBeDefined();
  });
});
