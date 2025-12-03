import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, it, expect } from "vitest";

import { PojoGenerator } from "../features/PojoGenerator";


describe("PojoGenerator", () => {
  it("renders correctly", () => {
    render(<PojoGenerator />);
    expect(screen.getByText("POJO Generator")).toBeDefined();
  });
});
