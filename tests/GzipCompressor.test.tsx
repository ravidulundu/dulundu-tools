import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GzipCompressor } from "../features/GzipCompressor";
import React from "react";

describe("GzipCompressor", () => {
  it("renders correctly", () => {
    render(<GzipCompressor />);
    expect(screen.getByText("GZip Compressor")).toBeDefined();
  });
});
