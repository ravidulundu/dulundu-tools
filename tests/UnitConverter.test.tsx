import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { UnitConverter } from "../features/UnitConverter";
import React from "react";

describe("UnitConverter", () => {
  it("converts length correctly", () => {
    render(<UnitConverter />);
    const input = screen.getByRole("spinbutton");
    const selects = screen.getAllByRole("combobox");
    const fromSelect = selects[0];
    const toSelect = selects[1];

    // Default is m to ft
    fireEvent.change(input, { target: { value: "1" } });
    fireEvent.change(fromSelect, { target: { value: "m" } });
    fireEvent.change(toSelect, { target: { value: "ft" } });

    // 1 m = 3.28084 ft
    expect(screen.getByText("3.2808")).toBeDefined();
  });

  it("converts weight correctly", () => {
    render(<UnitConverter />);
    const weightBtn = screen.getByText("Weight");
    fireEvent.click(weightBtn);

    const input = screen.getByRole("spinbutton");
    const selects = screen.getAllByRole("combobox");
    const fromSelect = selects[0];
    const toSelect = selects[1];

    // Default is kg to lb
    fireEvent.change(input, { target: { value: "1" } });
    fireEvent.change(fromSelect, { target: { value: "kg" } });
    fireEvent.change(toSelect, { target: { value: "lb" } });

    // 1 kg = 2.20462 lb
    expect(screen.getByText("2.2046")).toBeDefined();
  });

  it("converts temperature correctly", () => {
    render(<UnitConverter />);
    const tempBtn = screen.getByText("Temp");
    fireEvent.click(tempBtn);

    const input = screen.getByRole("spinbutton");
    const selects = screen.getAllByRole("combobox");
    const fromSelect = selects[0];
    const toSelect = selects[1];

    // Default is c to f
    fireEvent.change(input, { target: { value: "0" } });
    fireEvent.change(fromSelect, { target: { value: "c" } });
    fireEvent.change(toSelect, { target: { value: "f" } });

    // 0 C = 32 F
    expect(screen.getByText("32")).toBeDefined();
  });

  it("updates output when input changes", () => {
    render(<UnitConverter />);
    const input = screen.getByRole("spinbutton");

    // 10 m to ft
    fireEvent.change(input, { target: { value: "10" } });

    // 10 * 3.28084 = 32.8084
    expect(screen.getByText("32.8084")).toBeDefined();
  });
});
