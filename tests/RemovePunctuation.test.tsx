import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RemovePunctuation } from "../features/RemovePunctuation";
import React from "react";

describe("RemovePunctuation", () => {
  it("renders correctly", () => {
    render(<RemovePunctuation />);
    expect(screen.getByText("Remove Punctuation")).toBeDefined();
  });
});
