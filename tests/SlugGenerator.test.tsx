import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { SlugGenerator } from "../features/SlugGenerator";

describe("SlugGenerator", () => {
  it("generates slug correctly", () => {
    render(<SlugGenerator />);
    const input = screen.getByPlaceholderText("e.g. My New Blog Post");
    fireEvent.change(input, {
      target: { value: "Hello World! This is a Test." },
    });

    const output = screen.getByDisplayValue("hello-world-this-is-a-test");
    expect(output).toBeInTheDocument();
  });

  it("handles empty input", () => {
    render(<SlugGenerator />);
    const input = screen.getByPlaceholderText("e.g. My New Blog Post");
    fireEvent.change(input, { target: { value: "" } });

    const output = screen.queryByDisplayValue("hello-world-this-is-a-test");
    expect(output).not.toBeInTheDocument();
  });
});
