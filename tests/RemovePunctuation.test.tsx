import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, it, expect } from "vitest";

import { RemovePunctuation } from "../features/RemovePunctuation";


describe("RemovePunctuation", () => {
  it("renders correctly", () => {
    render(<RemovePunctuation />);
    expect(screen.getByText("Remove Punctuation")).toBeDefined();
  });
});
