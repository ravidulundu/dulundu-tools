import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, it, expect } from "vitest";

import { GzipCompressor } from "../features/GzipCompressor";


describe("GzipCompressor", () => {
  it("renders correctly", () => {
    render(<GzipCompressor />);
    expect(screen.getByText("GZip Compressor")).toBeDefined();
  });
});
