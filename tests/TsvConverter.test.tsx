import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TsvConverter } from "../features/TsvConverter";
import React from "react";

describe("TsvConverter", () => {
  it("converts TSV to JSON", async () => {
    render(<TsvConverter />);
    const textboxes = screen.getAllByRole("textbox");
    const input = textboxes[0] as HTMLTextAreaElement;
    const convertBtn = screen.getByText("Convert");

    fireEvent.change(input, { target: { value: "id\tname\n1\tJohn" } });
    fireEvent.click(convertBtn);

    await waitFor(() => {
      const output = textboxes[1] as HTMLTextAreaElement;
      expect(output.value).toContain('"id": "1"');
      expect(output.value).toContain('"name": "John"');
    });
  });

  it("converts JSON to TSV", async () => {
    render(<TsvConverter />);
    const modeBtn = screen.getByText("JSON to TSV");
    fireEvent.click(modeBtn);

    const textboxes = screen.getAllByRole("textbox");
    const input = textboxes[0] as HTMLTextAreaElement;
    const convertBtn = screen.getByText("Convert");

    fireEvent.change(input, {
      target: { value: '[{"id": "1", "name": "John"}]' },
    });
    fireEvent.click(convertBtn);

    await waitFor(() => {
      const output = textboxes[1] as HTMLTextAreaElement;
      expect(output.value).toContain("id\tname");
      expect(output.value).toContain("1\tJohn");
    });
  });

  it("handles empty input", async () => {
    render(<TsvConverter />);
    const convertBtn = screen.getByText("Convert");
    fireEvent.click(convertBtn);

    const textboxes = screen.getAllByRole("textbox");
    const output = textboxes[1] as HTMLTextAreaElement;
    expect(output.value).toBe("");
  });

  it("handles invalid TSV (missing rows)", async () => {
    render(<TsvConverter />);
    const textboxes = screen.getAllByRole("textbox");
    const input = textboxes[0] as HTMLTextAreaElement;
    const convertBtn = screen.getByText("Convert");

    fireEvent.change(input, { target: { value: "header_only" } });
    fireEvent.click(convertBtn);

    await waitFor(() => {
      expect(
        screen.getByText("TSV must have at least a header row and one data row")
      ).toBeInTheDocument();
    });
  });

  it("handles invalid JSON (not an array)", async () => {
    render(<TsvConverter />);
    const modeBtn = screen.getByText("JSON to TSV");
    fireEvent.click(modeBtn);

    const textboxes = screen.getAllByRole("textbox");
    const input = textboxes[0] as HTMLTextAreaElement;
    const convertBtn = screen.getByText("Convert");

    fireEvent.change(input, { target: { value: '{"id": 1}' } });
    fireEvent.click(convertBtn);

    await waitFor(() => {
      expect(
        screen.getByText("Input must be a JSON array")
      ).toBeInTheDocument();
    });
  });

  it("clears content", async () => {
    render(<TsvConverter />);
    const textboxes = screen.getAllByRole("textbox");
    const input = textboxes[0] as HTMLTextAreaElement;
    fireEvent.change(input, { target: { value: "test" } });

    const clearBtn = screen.getByTitle("Clear All");
    fireEvent.click(clearBtn);

    expect(input.value).toBe("");
  });
});
