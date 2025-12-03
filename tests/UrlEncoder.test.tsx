import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { UrlEncoder } from "../features/UrlEncoder";

describe("UrlEncoder", () => {
  it("encodes URL correctly", () => {
    render(<UrlEncoder />);
    const input = screen.getByPlaceholderText("Paste URL here to encode...");
    fireEvent.change(input, {
      target: { value: "https://example.com/foo bar" },
    });

    const output = screen.getByDisplayValue(
      "https%3A%2F%2Fexample.com%2Ffoo%20bar"
    );
    expect(output).toBeInTheDocument();
  });

  it("decodes URL correctly", () => {
    render(<UrlEncoder />);
    const toggleBtn = screen.getByText("Decode");
    fireEvent.click(toggleBtn);

    const input = screen.getByPlaceholderText(
      "Paste encoded URL here to decode..."
    );
    fireEvent.change(input, {
      target: { value: "https%3A%2F%2Fexample.com%2Ffoo%20bar" },
    });

    const output = screen.getByDisplayValue("https://example.com/foo bar");
    expect(output).toBeInTheDocument();
  });
});
