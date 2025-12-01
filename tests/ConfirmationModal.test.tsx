import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ConfirmationModal } from "../features/ReadmeGenerator/components/ConfirmationModal";
import React from "react";
import { ThemeProvider } from "../contexts/ThemeContext";
import { BrowserRouter } from "react-router-dom";

describe("ConfirmationModal", () => {
  it("renders without crashing", () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <ConfirmationModal
            isOpen={true}
            title="Test Title"
            message="Test message"
            onConfirm={() => {}}
            onCancel={() => {}}
          />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
