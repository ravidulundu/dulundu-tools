import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WordCounter } from "../features/WordCounter";
import React from "react";

describe("WordCounter", () => {
  beforeAll(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(),
      },
    });
  });

  it("calculates stats correctly", () => {
    render(<WordCounter />);
    const textarea = screen.getByRole("textbox");

    fireEvent.change(textarea, {
      target: { value: "Hello world.\nThis is a test." },
    });

    // Words: 5 (Hello, world., This, is, a, test. -> wait, split by space? "Hello", "world.", "This", "is", "a", "test." -> 6 words?)
    // "Hello world.\nThis is a test." -> split(/\s+/) -> ["Hello", "world.", "This", "is", "a", "test."] -> 6 words.
    expect(screen.getByText("6")).toBeDefined(); // Words

    // Chars: 28 (including newline)
    expect(screen.getByText("28")).toBeDefined(); // Chars

    // Lines: 2
    expect(screen.getByText("2")).toBeDefined(); // Lines
  });

  it("transforms text to uppercase", () => {
    render(<WordCounter />);
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "hello" } });

    const upperBtn = screen.getByText("UPPERCASE");
    fireEvent.click(upperBtn);

    expect(textarea).toHaveValue("HELLO");
  });

  it("transforms text to lowercase", () => {
    render(<WordCounter />);
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "HELLO" } });

    const lowerBtn = screen.getByText("lowercase");
    fireEvent.click(lowerBtn);

    expect(textarea).toHaveValue("hello");
  });

  it("clears text", () => {
    render(<WordCounter />);
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "test" } });

    const clearBtn = screen.getByTitle("Clear");
    fireEvent.click(clearBtn);

    expect(textarea).toHaveValue("");
  });
});
