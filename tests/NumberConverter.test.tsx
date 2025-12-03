import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, it, expect } from "vitest";

import { NumberConverter } from "../features/NumberConverter";


describe("NumberConverter", () => {
  it("renders correctly", () => {
    render(<NumberConverter />);
    expect(screen.getByText("Number Base Converter")).toBeDefined();
  });
});
