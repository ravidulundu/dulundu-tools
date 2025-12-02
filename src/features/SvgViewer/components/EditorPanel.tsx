import React from "react";
import Editor from "@monaco-editor/react";
import { useSVG } from "../context/SVGContext";
import clsx from "clsx";
import { ShareModal } from "./ShareModal";
import { EditorTopBar } from "./EditorTopBar";
import { EditorBottomBar } from "./EditorBottomBar";
import { useEditorHover } from "../hooks/useEditorHover";
import { optimizeSvg } from "../utils/svgOptimizer";

const EditorPanel = () => {
  const {
    svgCode,
    setSvgCode,
    optimizationStats,
    setOptimizationStats,
    setHoveredElement,
  } = useSVG();

  const [cursorPosition, setCursorPosition] = React.useState({
    line: 1,
    column: 1,
  });
  // Use state instead of ref to trigger re-render when editor mounts
  const [editorInstance, setEditorInstance] = React.useState<any>(null);
  const editorRef = React.useRef<any>(null); // Keep ref for other usages if needed, or sync them
  const [showShareModal, setShowShareModal] = React.useState(false);
  const [isDragOver, setIsDragOver] = React.useState(false);

  // Track hover for highlighting - pass the instance, not the ref
  const hoverInfo = useEditorHover(editorInstance);

  React.useEffect(() => {
    // console.log('Editor Hover Info:', hoverInfo); // Debug log
    if (hoverInfo) {
      setHoveredElement({
        lineNumber: hoverInfo.lineNumber,
        elementType: hoverInfo.elementType,
        elementIndex: hoverInfo.elementIndex,
      });
    } else {
      setHoveredElement(null);
    }
  }, [hoverInfo, setHoveredElement]);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    setEditorInstance(editor); // Trigger re-render with editor instance

    editor.onDidChangeCursorPosition((e: any) => {
      setCursorPosition({
        line: e.position.lineNumber,
        column: e.position.column,
      });
    });
  };

  // Calculate optimization stats on code change
  React.useEffect(() => {
    if (!svgCode) {
      setOptimizationStats(null);
      return;
    }

    const originalSize = new Blob([svgCode]).size;

    // Advanced SVG optimization
    const optimized = optimizeSvg(svgCode);

    const optimizedSize = new Blob([optimized]).size;
    const percentage = Math.round(
      ((originalSize - optimizedSize) / originalSize) * 100
    );

    setOptimizationStats({
      originalSize,
      optimizedSize,
      percentage,
    });
  }, [svgCode]);

  return (
    <div className="h-full w-full bg-white dark:bg-[#1e1e1e] flex flex-col relative">
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        svgCode={svgCode}
      />

      <EditorTopBar
        svgCode={svgCode}
        setSvgCode={setSvgCode}
        editorRef={editorRef}
        optimizationStats={optimizationStats}
        cursorPosition={cursorPosition}
      />

      {/* Editor Area */}
      <div
        className={clsx(
          "flex-1 overflow-hidden transition-colors relative",
          isDragOver && "bg-blue-50/10 ring-2 ring-inset ring-blue-500"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          const droppedSvg = e.dataTransfer.getData("text/plain");
          if (droppedSvg && droppedSvg.includes("<svg")) {
            setSvgCode(droppedSvg);
          }
        }}
      >
        <Editor
          height="100%"
          defaultLanguage="xml"
          value={svgCode}
          onChange={(value) => setSvgCode(value || "")}
          theme="vs-dark"
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            wordWrap: "on",
            padding: { top: 16, bottom: 16 },
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            renderLineHighlight: "none",
            // Disable native drag and drop to prevent conflict
            dragAndDrop: false,
          }}
        />
      </div>

      <EditorBottomBar
        svgCode={svgCode}
        setSvgCode={setSvgCode}
        onShare={() => setShowShareModal(true)}
      />
    </div>
  );
};

export default EditorPanel;
