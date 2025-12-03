import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { describe, it, expect } from "vitest";

import { JsonConverter } from "../features/JsonConverter";


describe("JsonConverter", () => {
  it("renders correctly", () => {
    render(<JsonConverter />);
    expect(screen.getByText("JSON Converter")).toBeInTheDocument();
  });

  it("converts JSON to XML", async () => {
    render(<JsonConverter />);
    const textboxes = screen.getAllByRole("textbox");
    const input = textboxes[0] as HTMLTextAreaElement;
    const convertBtn = screen.getByText("Convert");

    fireEvent.change(input, { target: { value: '{"key": "value"}' } });
    fireEvent.click(convertBtn);

    await waitFor(() => {
      const output = textboxes[1] as HTMLTextAreaElement;
      expect(output.value).toContain("<root>");
      expect(output.value).toContain("<key>value</key>");
    });
  });

  it("converts JSON to CSV", async () => {
    render(<JsonConverter />);
    const modeBtn = screen.getByText("JSON to CSV");
    fireEvent.click(modeBtn);

    const textboxes = screen.getAllByRole("textbox");
    const input = textboxes[0] as HTMLTextAreaElement;
    const convertBtn = screen.getByText("Convert");

    fireEvent.change(input, {
      target: { value: '[{"id": 1, "name": "Test"}]' },
    });
    fireEvent.click(convertBtn);

    await waitFor(() => {
      const output = textboxes[1];
      expect(output).toHaveValue('id,name\n"1","Test"');
    });
  });

  it("handles invalid JSON", async () => {
    render(<JsonConverter />);
    const textboxes = screen.getAllByRole("textbox");
    const input = textboxes[0] as HTMLTextAreaElement;
    const convertBtn = screen.getByText("Convert");

    fireEvent.change(input, { target: { value: "invalid json" } });
    fireEvent.click(convertBtn);

    await waitFor(() => {
      expect(screen.getByText(/Unexpected token/i)).toBeInTheDocument();
    });
  });

  it("handles JSON to CSV error (not an array)", async () => {
    render(<JsonConverter />);
    const modeBtn = screen.getByText("JSON to CSV");
    fireEvent.click(modeBtn);

    const textboxes = screen.getAllByRole("textbox");
    const input = textboxes[0] as HTMLTextAreaElement;
    const convertBtn = screen.getByText("Convert");

    // Although the code wraps non-array in array, let's test empty array or other edge cases if possible.
    // The code says: const data = Array.isArray(parsed) ? parsed : [parsed];
    // So it handles objects.
    // But jsonToCsv throws if empty array.
    fireEvent.change(input, { target: { value: "[]" } });
    fireEvent.click(convertBtn);

    await waitFor(() => {
      expect(
        screen.getByText("JSON must be a non-empty array of objects")
      ).toBeInTheDocument();
    });
  });
});
