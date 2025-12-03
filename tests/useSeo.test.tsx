import { renderHook } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";

import { useSeo } from "../hooks/useSeo";

describe("useSeo", () => {
  const defaultTitle = "Dulundu.tools - Free Developer Utilities";
  const defaultDescription =
    "A comprehensive collection of free developer tools including formatters, converters, generators, and AI assistants.";
  const defaultKeywords =
    "developer tools, json formatter, base64 converter, sql beautifier, ai code assistant, web tools, free utilities";

  beforeEach(() => {
    document.title = "";
    // Clear existing meta tags
    const metas = document.querySelectorAll(
      'meta[name="description"], meta[name="keywords"]'
    );
    metas.forEach((meta) => meta.remove());
  });

  it("should set default title and meta tags when no props are provided", () => {
    renderHook(() => useSeo({}));

    expect(document.title).toBe(defaultTitle);

    const metaDescription = document.querySelector('meta[name="description"]');
    expect(metaDescription?.getAttribute("content")).toBe(defaultDescription);

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    expect(metaKeywords?.getAttribute("content")).toBe(defaultKeywords);
  });

  it("should set custom title and meta tags", () => {
    const props = {
      title: "Test Tool",
      description: "Test Description",
      keywords: "test, keywords",
    };

    renderHook(() => useSeo(props));

    expect(document.title).toBe(`Test Tool - Dulundu.tools`);

    const metaDescription = document.querySelector('meta[name="description"]');
    expect(metaDescription?.getAttribute("content")).toBe(props.description);

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    expect(metaKeywords?.getAttribute("content")).toBe(props.keywords);
  });

  it("should update meta tags when props change", () => {
    const { rerender } = renderHook((props) => useSeo(props), {
      initialProps: { title: "Initial", description: "Initial Desc" },
    });

    expect(document.title).toBe("Initial - Dulundu.tools");

    rerender({ title: "Updated", description: "Updated Desc" });

    expect(document.title).toBe("Updated - Dulundu.tools");
    const metaDescription = document.querySelector('meta[name="description"]');
    expect(metaDescription?.getAttribute("content")).toBe("Updated Desc");
  });
});
