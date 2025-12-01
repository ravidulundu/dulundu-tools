import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ActionButton } from "../components/common/ActionButton";
import { Settings } from "lucide-react";
import React from "react";
import { ThemeProvider } from "../contexts/ThemeContext";
import { BrowserRouter } from "react-router-dom";

describe("ActionButton", () => {
  it("renders without crashing", () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <ActionButton
            label="Test Action"
            onClick={() => {}}
            icon={Settings}
          />
        </ThemeProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeDefined();
  });
});
