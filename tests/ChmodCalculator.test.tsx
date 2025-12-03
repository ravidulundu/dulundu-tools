import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, it, expect } from "vitest";

import { ChmodCalculator } from "../features/ChmodCalculator";


describe("ChmodCalculator", () => {
  it("renders correctly", () => {
    render(<ChmodCalculator />);
    expect(screen.getByText("Chmod Calculator")).toBeDefined();
  });
});
