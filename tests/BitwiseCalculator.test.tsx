import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BitwiseCalculator } from "../features/BitwiseCalculator";
import React from "react";

describe("BitwiseCalculator", () => {
  it("renders correctly", () => {
    render(<BitwiseCalculator />);
    expect(screen.getByText("Bitwise Calculator")).toBeDefined();
  });
});
