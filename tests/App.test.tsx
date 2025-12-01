import { render, screen } from "@testing-library/react";
import App from "../App";
import { describe, it, expect, vi } from "vitest";

// Mock child components to avoid complex rendering and context issues
vi.mock("../components/Analytics", () => ({
  Analytics: () => <div data-testid="analytics">Analytics</div>,
}));

vi.mock("../components/Layout", () => ({
  Layout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">{children}</div>
  ),
}));

vi.mock("../components/Loading", () => ({
  Loading: () => <div data-testid="loading">Loading</div>,
}));

vi.mock("../components/ScrollToTop", () => ({
  ScrollToTop: () => <div data-testid="scroll-to-top">ScrollToTop</div>,
}));

vi.mock("../components/SeoManager", () => ({
  SeoManager: () => <div data-testid="seo-manager">SeoManager</div>,
}));

vi.mock("../routes", () => ({
  routes: [
    { path: "/", element: <div data-testid="home-page">Home Page</div> },
  ],
}));

describe("App", () => {
  it("renders without crashing", () => {
    render(<App />);
    expect(screen.getByTestId("layout")).toBeInTheDocument();
    expect(screen.getByTestId("analytics")).toBeInTheDocument();
    expect(screen.getByTestId("seo-manager")).toBeInTheDocument();
    expect(screen.getByTestId("scroll-to-top")).toBeInTheDocument();
  });
});
