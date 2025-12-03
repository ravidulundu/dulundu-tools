import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, it, expect } from "vitest";

import { DnsLookup } from "../features/DnsLookup";


describe("DnsLookup", () => {
  it("renders correctly", () => {
    render(<DnsLookup />);
    expect(screen.getByText("DNS Lookup")).toBeDefined();
  });
});
