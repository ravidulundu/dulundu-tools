import { render, screen } from "@testing-library/react";
import { Settings } from "lucide-react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";

import { ActionButton } from "../components/common/ActionButton";
import { ThemeProvider } from "../contexts/ThemeContext";

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
