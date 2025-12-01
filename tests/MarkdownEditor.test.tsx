import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MarkdownEditor } from "../features/MarkdownEditor";
import React from "react";

describe("MarkdownEditor", () => {
  it("renders correctly", () => {
    render(<MarkdownEditor />);
    expect(screen.getByText("Markdown Editor")).toBeDefined();
  });
});
