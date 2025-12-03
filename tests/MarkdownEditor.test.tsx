import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, it, expect } from "vitest";

import { MarkdownEditor } from "../features/MarkdownEditor";


describe("MarkdownEditor", () => {
  it("renders correctly", () => {
    render(<MarkdownEditor />);
    expect(screen.getByText("Markdown Editor")).toBeDefined();
  });
});
