import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, it, expect } from "vitest";

import { TokenGenerator } from "../features/TokenGenerator";


describe("TokenGenerator", () => {
  it("renders correctly", () => {
    render(<TokenGenerator />);
    expect(screen.getByText("Token Generator")).toBeDefined();
  });
});
