import { render } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";

import { ThemeProvider } from "../contexts/ThemeContext";
import { ConfirmationModal } from "../features/ReadmeGenerator/components/ConfirmationModal";

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
