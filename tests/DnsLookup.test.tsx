import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DnsLookup } from "../features/DnsLookup";
import React from "react";

describe("DnsLookup", () => {
  it("renders correctly", () => {
    render(<DnsLookup />);
    expect(screen.getByText("DNS Lookup")).toBeDefined();
  });
});
