import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { describe, it, expect } from "vitest";

import { SqlConverter } from "../features/SqlConverter";


describe("SqlConverter", () => {
  it("renders correctly", () => {
    render(<SqlConverter />);
    expect(screen.getByText("SQL Converter")).toBeInTheDocument();
  });

  it("converts SQL to JSON", async () => {
    render(<SqlConverter />);
    const textboxes = screen.getAllByRole("textbox");
    const input = textboxes[0] as HTMLTextAreaElement;
    const convertBtn = screen.getByText("Convert");

    const sql = "INSERT INTO users (id, name) VALUES (1, 'Alice');";
    fireEvent.change(input, { target: { value: sql } });
    fireEvent.click(convertBtn);

    await waitFor(() => {
      const output = textboxes[1];
      const expected = JSON.stringify([{ id: 1, name: "Alice" }], null, 2);
      expect(output).toHaveValue(expected);
    });
  });

  it("converts SQL to CSV", async () => {
    render(<SqlConverter />);
    const modeBtn = screen.getByText("SQL to CSV");
    fireEvent.click(modeBtn);

    const textboxes = screen.getAllByRole("textbox");
    const input = textboxes[0] as HTMLTextAreaElement;
    const convertBtn = screen.getByText("Convert");

    const sql = "INSERT INTO users (id, name) VALUES (1, 'Alice');";
    fireEvent.change(input, { target: { value: sql } });
    fireEvent.click(convertBtn);

    await waitFor(() => {
      const output = textboxes[1];
      expect(output).toHaveValue('id,name\n1,"Alice"');
    });
  });

  it("handles invalid SQL", async () => {
    render(<SqlConverter />);
    const textboxes = screen.getAllByRole("textbox");
    const input = textboxes[0] as HTMLTextAreaElement;
    const convertBtn = screen.getByText("Convert");

    fireEvent.change(input, { target: { value: "SELECT * FROM users" } });
    fireEvent.click(convertBtn);

    await waitFor(() => {
      expect(screen.getByText(/Error parsing SQL/i)).toBeInTheDocument();
    });
  });

  it("handles complex SQL values", async () => {
    render(<SqlConverter />);
    const textboxes = screen.getAllByRole("textbox");
    const input = textboxes[0] as HTMLTextAreaElement;
    const convertBtn = screen.getByText("Convert");

    const sql = "INSERT INTO table (col1, col2) VALUES (NULL, 'O''Neil');";
    fireEvent.change(input, { target: { value: sql } });
    fireEvent.click(convertBtn);

    await waitFor(() => {
      const output = textboxes[1];
      const expected = JSON.stringify(
        [{ col1: null, col2: "O'Neil" }],
        null,
        2
      );
      expect(output).toHaveValue(expected);
    });
  });
});
