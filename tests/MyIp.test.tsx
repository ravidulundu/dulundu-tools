import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, it, expect } from "vitest";

import { MyIp } from "../features/MyIp";


describe("MyIp", () => {
  it("renders correctly", () => {
    render(<MyIp />);
    expect(screen.getByText("My IP Address")).toBeDefined();
  });
});
