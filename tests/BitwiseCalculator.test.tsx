import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, it, expect } from "vitest";

import { BitwiseCalculator } from "../features/BitwiseCalculator";


describe("BitwiseCalculator", () => {
  it("renders correctly", () => {
    render(<BitwiseCalculator />);
    expect(screen.getByText("Bitwise Calculator")).toBeDefined();
  });
});
