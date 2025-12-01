import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChmodCalculator } from "../features/ChmodCalculator";
import React from "react";

describe("ChmodCalculator", () => {
  it("renders correctly", () => {
    render(<ChmodCalculator />);
    expect(screen.getByText("Chmod Calculator")).toBeDefined();
  });
});
