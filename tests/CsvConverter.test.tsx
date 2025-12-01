import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CsvConverter } from "../features/CsvConverter";
import React from "react";
import { ThemeProvider } from "../contexts/ThemeContext";
import { BrowserRouter } from "react-router-dom";

const renderComponent = () => {
  render(
    <BrowserRouter>
      <ThemeProvider>
        <CsvConverter />
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe("CsvConverter", () => {
  it("renders correctly", () => {
    renderComponent();
    expect(screen.getByText("CSV to JSON")).toBeInTheDocument();
  });

  it("converts CSV to JSON", async () => {
    renderComponent();
    const textboxes = screen.getAllByRole("textbox");
    const input = textboxes[0] as HTMLTextAreaElement;
    const convertBtn = screen.getByText("Convert");

    fireEvent.change(input, { target: { value: "id,name\n1,Test" } });
    fireEvent.click(convertBtn);

    await waitFor(() => {
      const output = textboxes[1];
      const expected = JSON.stringify([{ id: "1", name: "Test" }], null, 2);
      expect(output).toHaveValue(expected);
    });
  });

  it("handles empty input", async () => {
    renderComponent();
    const convertBtn = screen.getByText("Convert");
    fireEvent.click(convertBtn);

    await waitFor(() => {
      const textboxes = screen.getAllByRole("textbox");
      expect(textboxes[1]).toHaveValue("");
    });
  });

  it("handles invalid CSV (missing rows)", async () => {
    renderComponent();
    const textboxes = screen.getAllByRole("textbox");
    const input = textboxes[0] as HTMLTextAreaElement;
    const convertBtn = screen.getByText("Convert");

    fireEvent.change(input, { target: { value: "header_only" } });
    fireEvent.click(convertBtn);

    await waitFor(() => {
      expect(
        screen.getByText("CSV must have at least a header row and one data row")
      ).toBeInTheDocument();
    });
  });

  it("clears content", async () => {
    renderComponent();
    const textboxes = screen.getAllByRole("textbox");
    const input = textboxes[0] as HTMLTextAreaElement;
    fireEvent.change(input, { target: { value: "test" } });

    const clearBtn = screen.getByTitle("Clear All");
    fireEvent.click(clearBtn);

    expect(input).toHaveValue("");
  });
});
