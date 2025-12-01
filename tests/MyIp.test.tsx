import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MyIp } from "../features/MyIp";
import React from "react";

describe("MyIp", () => {
  it("renders correctly", () => {
    render(<MyIp />);
    expect(screen.getByText("My IP Address")).toBeDefined();
  });
});
