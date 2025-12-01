import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WordpressPasswordHash } from "../features/WordpressPasswordHash";
import React from "react";
import { ThemeProvider } from "../contexts/ThemeContext";
import { BrowserRouter } from "react-router-dom";

// Mock bcryptjs
vi.mock("bcryptjs", () => ({
  default: {
    genSaltSync: () => "somesalt",
    hashSync: (pwd: string, salt: string) => `hashed_${pwd}_${salt}`,
  },
}));

describe("WordpressPasswordHash", () => {
  beforeAll(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(),
      },
    });
  });

  it("generates hash correctly", () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <WordpressPasswordHash />
        </ThemeProvider>
      </BrowserRouter>
    );

    const inputs = screen.getAllByRole("textbox");
    const passwordInput = inputs[0];

    fireEvent.change(passwordInput, { target: { value: "mypassword" } });

    const generateBtn = screen.getByText("Generate Hash");
    fireEvent.click(generateBtn);

    const hashInput = inputs[1];
    expect(hashInput).toHaveValue("hashed_mypassword_somesalt");
  });

  it("clears content", () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <WordpressPasswordHash />
        </ThemeProvider>
      </BrowserRouter>
    );

    const inputs = screen.getAllByRole("textbox");
    const passwordInput = inputs[0];

    fireEvent.change(passwordInput, { target: { value: "test" } });

    const clearBtn = screen.getByTitle("Clear All");
    fireEvent.click(clearBtn);

    expect(passwordInput).toHaveValue("");
    expect(inputs[1]).toHaveValue("");
  });
});
