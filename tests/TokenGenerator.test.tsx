import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TokenGenerator } from "../features/TokenGenerator";
import React from "react";

describe("TokenGenerator", () => {
  it("renders correctly", () => {
    render(<TokenGenerator />);
    expect(screen.getByText("Token Generator")).toBeDefined();
  });
});
