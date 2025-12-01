import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PojoGenerator } from "../features/PojoGenerator";
import React from "react";

describe("PojoGenerator", () => {
  it("renders correctly", () => {
    render(<PojoGenerator />);
    expect(screen.getByText("POJO Generator")).toBeDefined();
  });
});
