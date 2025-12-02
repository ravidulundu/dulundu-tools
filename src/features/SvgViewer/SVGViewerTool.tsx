import React from "react";
import { SVGProvider } from "./context/SVGContext";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { GripVertical } from "lucide-react";
import EditorPanel from "./components/EditorPanel";
import PreviewPanel from "./components/PreviewPanel";
import { Sidebar } from "./components/Sidebar/Sidebar";

import { useParams } from "react-router-dom";
import { useSVG } from "./context/SVGContext";

// Component to handle URL parameters for shared SVGs
const UrlHandler = () => {
  const { id } = useParams();
  const { setSvgCode } = useSVG();

  React.useEffect(() => {
    if (id) {
      fetch(`/api/share/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Share not found");
          return res.json();
        })
        .then((data) => {
          if (data.content) {
            setSvgCode(data.content);
          }
        })
        .catch((err) => {
          console.error("Error fetching shared SVG:", err);
          // Optional: Show toast or error notification
        });
    }
  }, [id, setSvgCode]);

  return null;
};

const SVGViewerTool = () => {
  return (
    <SVGProvider>
      <UrlHandler />
      <div className="h-[calc(100vh-64px)] w-full bg-white dark:bg-gray-950 flex flex-col">
        <PanelGroup direction="horizontal" className="flex-1">
          {/* Left Panel: Icon Library */}
          <Panel
            defaultSize={20}
            minSize={15}
            maxSize={30}
            className="flex flex-col border-r border-gray-200 dark:border-gray-800"
          >
            <Sidebar />
          </Panel>

          <PanelResizeHandle className="w-1 bg-gray-100 dark:bg-gray-900 hover:bg-blue-500 transition-colors flex items-center justify-center group">
            <GripVertical className="h-4 w-4 text-gray-400 group-hover:text-white" />
          </PanelResizeHandle>

          {/* Middle Panel: Editor */}
          <Panel
            defaultSize={40}
            minSize={30}
            className="flex flex-col border-r border-gray-200 dark:border-gray-800"
          >
            <EditorPanel />
          </Panel>

          <PanelResizeHandle className="w-1 bg-gray-100 dark:bg-gray-900 hover:bg-blue-500 transition-colors flex items-center justify-center group">
            <GripVertical className="h-4 w-4 text-gray-400 group-hover:text-white" />
          </PanelResizeHandle>

          {/* Right Panel: Preview */}
          <Panel defaultSize={40} minSize={30} className="flex flex-col">
            <PreviewPanel />
          </Panel>
        </PanelGroup>
      </div>
    </SVGProvider>
  );
};

export default SVGViewerTool;
