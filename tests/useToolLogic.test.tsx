import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { useToolLogic } from "../hooks/useToolLogic";

describe("useToolLogic", () => {
  it("should initialize with default values", () => {
    const { result } = renderHook(() => useToolLogic());

    expect(result.current.input).toBe("");
    expect(result.current.output).toBe("");
    expect(result.current.error).toBeNull();
    expect(result.current.copied).toBe(false);
  });

  it("should initialize with provided values", () => {
    const { result } = renderHook(() =>
      useToolLogic({
        initialInput: "test input",
        initialOutput: "test output",
      })
    );

    expect(result.current.input).toBe("test input");
    expect(result.current.output).toBe("test output");
  });

  it("should update input and output", () => {
    const { result } = renderHook(() => useToolLogic());

    act(() => {
      result.current.setInput("new input");
      result.current.setOutput("new output");
    });

    expect(result.current.input).toBe("new input");
    expect(result.current.output).toBe("new output");
  });

  it("should handle clear", () => {
    const { result } = renderHook(() =>
      useToolLogic({
        initialInput: "test",
        initialOutput: "test",
      })
    );

    act(() => {
      result.current.handleClear();
    });

    expect(result.current.input).toBe("");
    expect(result.current.output).toBe("");
    expect(result.current.error).toBeNull();
  });

  it("should handle copy", () => {
    const { result } = renderHook(() =>
      useToolLogic({ initialOutput: "copy me" })
    );

    // Mock navigator.clipboard
    const writeTextMock = vi.fn();
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    act(() => {
      result.current.handleCopy();
    });

    expect(writeTextMock).toHaveBeenCalledWith("copy me");
    expect(result.current.copied).toBe(true);
  });

  it("should handle file upload", () => {
    const { result } = renderHook(() => useToolLogic());
    const file = new File(["file content"], "test.txt", { type: "text/plain" });
    const event = {
      target: {
        files: [file],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    const callback = vi.fn();

    // Mock FileReader
    // Mock FileReader
    const readAsTextMock = vi.fn();
    let onloadRef: ((event: ProgressEvent<FileReader>) => void) | null = null;

    class MockFileReader {
      readAsText = readAsTextMock;
      set onload(fn: (event: ProgressEvent<FileReader>) => void) {
        onloadRef = fn;
      }
      get onload(): ((event: ProgressEvent<FileReader>) => void) | null {
        return onloadRef;
      }
    }

    vi.stubGlobal("FileReader", MockFileReader);

    act(() => {
      result.current.handleFileUpload(event, callback);
    });

    expect(readAsTextMock).toHaveBeenCalledWith(file);

    // Simulate onload
    act(() => {
      if (onloadRef) {
        onloadRef({
          target: { result: "file content" },
        } as unknown as ProgressEvent<FileReader>);
      }
    });

    expect(result.current.input).toBe("file content");
    expect(callback).toHaveBeenCalledWith("file content");
  });

  it("should handle download", () => {
    const { result } = renderHook(() =>
      useToolLogic({ initialOutput: "download me" })
    );

    // Mock URL.createObjectURL and URL.revokeObjectURL
    const createObjectURLMock = vi.fn(() => "blob:url");
    const revokeObjectURLMock = vi.fn();
    window.URL.createObjectURL = createObjectURLMock;
    window.URL.revokeObjectURL = revokeObjectURLMock;

    // Mock document.createElement and click
    const clickMock = vi.fn();
    const linkMock = {
      href: "",
      download: "",
      click: clickMock,
    };
    const createElementMock = vi
      .spyOn(document, "createElement")
      .mockReturnValue(linkMock as unknown as HTMLAnchorElement);

    act(() => {
      result.current.handleDownload("test.txt");
    });

    expect(createObjectURLMock).toHaveBeenCalled();
    expect(linkMock.download).toBe("test.txt");
    expect(clickMock).toHaveBeenCalled();
    expect(revokeObjectURLMock).toHaveBeenCalledWith("blob:url");

    createElementMock.mockRestore();
  });
});
