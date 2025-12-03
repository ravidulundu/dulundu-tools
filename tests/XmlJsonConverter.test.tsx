import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";

import { ThemeProvider } from "../contexts/ThemeContext";
import { XmlJsonConverter } from "../features/XmlJsonConverter";

describe("XmlJsonConverter", () => {
  it("converts XML to JSON", async () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <XmlJsonConverter />
        </ThemeProvider>
      </BrowserRouter>
    );
    const textboxes = screen.getAllByRole("textbox");
    const input = textboxes[0] as HTMLTextAreaElement;
    const convertBtn = screen.getByText("Convert");

    fireEvent.change(input, {
      target: { value: "<root><item>Value</item></root>" },
    });
    fireEvent.click(convertBtn);

    await waitFor(() => {
      const output = textboxes[1] as HTMLTextAreaElement;
      expect(output.value).toContain('"root"');
      expect(output.value).toContain('"item": "Value"');
    });
  });

  it("converts JSON to XML", async () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <XmlJsonConverter />
        </ThemeProvider>
      </BrowserRouter>
    );
    const modeBtn = screen.getByText("JSON to XML");
    fireEvent.click(modeBtn);

    const textboxes = screen.getAllByRole("textbox");
    const input = textboxes[0] as HTMLTextAreaElement;
    const convertBtn = screen.getByText("Convert");

    fireEvent.change(input, {
      target: { value: '{"root": {"item": "Value"}}' },
    });
    fireEvent.click(convertBtn);

    await waitFor(() => {
      const output = textboxes[1] as HTMLTextAreaElement;
      expect(output.value).toContain("<root>");
      expect(output.value).toContain("<item>Value</item>");
    });
  });

  it("handles XML attributes", async () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <XmlJsonConverter />
        </ThemeProvider>
      </BrowserRouter>
    );
    const textboxes = screen.getAllByRole("textbox");
    const input = textboxes[0] as HTMLTextAreaElement;
    const convertBtn = screen.getByText("Convert");

    fireEvent.change(input, {
      target: { value: '<root id="1"><item>Value</item></root>' },
    });
    fireEvent.click(convertBtn);

    await waitFor(() => {
      const output = textboxes[1] as HTMLTextAreaElement;
      expect(output.value).toContain('"@attributes"');
      expect(output.value).toContain('"id": "1"');
    });
  });

  it("handles XML arrays", async () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <XmlJsonConverter />
        </ThemeProvider>
      </BrowserRouter>
    );
    const textboxes = screen.getAllByRole("textbox");
    const input = textboxes[0] as HTMLTextAreaElement;
    const convertBtn = screen.getByText("Convert");

    fireEvent.change(input, {
      target: { value: "<root><item>A</item><item>B</item></root>" },
    });
    fireEvent.click(convertBtn);

    await waitFor(() => {
      const output = textboxes[1] as HTMLTextAreaElement;
      expect(output.value).toContain('"item": [');
      expect(output.value).toContain('"A"');
      expect(output.value).toContain('"B"');
    });
  });

  it("handles invalid XML", async () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <XmlJsonConverter />
        </ThemeProvider>
      </BrowserRouter>
    );
    const textboxes = screen.getAllByRole("textbox");
    const input = textboxes[0] as HTMLTextAreaElement;
    const convertBtn = screen.getByText("Convert");

    fireEvent.change(input, { target: { value: "<root>missing closing tag" } });
    fireEvent.click(convertBtn);

    await waitFor(() => {
      expect(screen.getByText("Invalid XML Format")).toBeInTheDocument();
    });
  });

  it("handles invalid JSON", async () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <XmlJsonConverter />
        </ThemeProvider>
      </BrowserRouter>
    );
    const modeBtn = screen.getByText("JSON to XML");
    fireEvent.click(modeBtn);

    const textboxes = screen.getAllByRole("textbox");
    const input = textboxes[0] as HTMLTextAreaElement;
    const convertBtn = screen.getByText("Convert");

    fireEvent.change(input, { target: { value: "{invalid json}" } });
    fireEvent.click(convertBtn);

    await waitFor(() => {
      expect(screen.getByText(/Expected property name/i)).toBeInTheDocument();
    });
  });

  it("clears content", async () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <XmlJsonConverter />
        </ThemeProvider>
      </BrowserRouter>
    );
    const textboxes = screen.getAllByRole("textbox");
    const input = textboxes[0] as HTMLTextAreaElement;
    fireEvent.change(input, { target: { value: "test" } });

    const clearBtn = screen.getByTitle("Clear All");
    fireEvent.click(clearBtn);

    expect(input.value).toBe("");
  });
});
