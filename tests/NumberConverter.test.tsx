import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NumberConverter } from "../features/NumberConverter";
import React from "react";

describe("NumberConverter", () => {
  it("renders correctly", () => {
    render(<NumberConverter />);
    expect(screen.getByText("Number Base Converter")).toBeDefined();
  });
});
