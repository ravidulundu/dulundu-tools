import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { WhoisLookup } from "../features/WhoisLookup";


describe("WhoisLookup", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders correctly", () => {
    render(<WhoisLookup />);
    expect(screen.getByText("Whois Lookup")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("example.com")).toBeInTheDocument();
  });

  it("validates domain input", async () => {
    render(<WhoisLookup />);
    const input = screen.getByPlaceholderText("example.com");
    const button = screen.getByText("Lookup");

    fireEvent.change(input, { target: { value: "invalid" } });
    fireEvent.click(button);

    expect(
      await screen.findByText("Please enter a valid domain (e.g., google.com)")
    ).toBeInTheDocument();
  });

  it("handles successful lookup", async () => {
    const mockData = {
      handle: "TEST-HANDLE",
      ldhName: "example.com",
      status: ["active"],
      events: [
        { eventAction: "registration", eventDate: "2023-01-01T00:00:00Z" },
      ],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    render(<WhoisLookup />);
    const input = screen.getByPlaceholderText("example.com");
    const button = screen.getByText("Lookup");

    fireEvent.change(input, { target: { value: "example.com" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("TEST-HANDLE")).toBeInTheDocument();
      expect(screen.getByText("example.com")).toBeInTheDocument();
      expect(screen.getByText("active")).toBeInTheDocument();
    });
  });

  it("handles lookup error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
    });

    render(<WhoisLookup />);
    const input = screen.getByPlaceholderText("example.com");
    const button = screen.getByText("Lookup");

    fireEvent.change(input, { target: { value: "example.com" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(
        screen.getByText("Domain not found or registry does not support RDAP")
      ).toBeInTheDocument();
    });
  });

  it("handles clear action", async () => {
    render(<WhoisLookup />);
    const input = screen.getByPlaceholderText("example.com");
    fireEvent.change(input, { target: { value: "example.com" } });

    const clearButton = screen.getByTitle("Clear All");
    fireEvent.click(clearButton);

    expect(input).toHaveValue("");
  });
});
