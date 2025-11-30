import React, { useState, useEffect, useRef } from "react";
import { SECTIONS, Section } from "./data/sections";
import { ConfirmationModal } from "./components/ConfirmationModal";
import { PreviewAndRaw } from "./components/PreviewAndRaw";
import { useTheme } from "../../contexts/ThemeContext";
import MDEditor from "@uiw/react-md-editor";
import "./MDEditor.css";
import { SEO } from "../../components/SEO";

// Extended Section interface to track inclusion state
interface ExtendedSection extends Section {
  isIncluded: boolean;
  content: string; // Ensure content is always present
}

export const ReadmeGenerator = () => {
  // Get theme from ThemeProvider
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Initialize with all sections, but none included by default
  const [sections, setSections] = useState<ExtendedSection[]>(() => {
    return SECTIONS.map((s) => ({
      ...s,
      isIncluded: false,
      content: s.content || "",
    }));
  });

  // Full markdown state - user can edit freely in MDEditor
  const [fullMarkdown, setFullMarkdown] = useState<string>("");
  const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Track previous sections to detect changes
  const prevSectionsRef = useRef<ExtendedSection[]>([]);

  // Update fullMarkdown when sections change (add/remove/reorder)
  useEffect(() => {
    const prevSections = prevSectionsRef.current;
    const currentSections = sections;

    // Check if sections actually changed (not just a re-render)
    const sectionsChanged =
      prevSections.length !== currentSections.length ||
      prevSections.some(
        (prev, idx) =>
          prev.id !== currentSections[idx]?.id ||
          prev.isIncluded !== currentSections[idx]?.isIncluded
      );

    if (sectionsChanged) {
      // Regenerate markdown from selected sections
      const combined = currentSections
        .filter((s) => s.isIncluded)
        .map((s) => s.content)
        .join("\n\n");
      setFullMarkdown(combined);

      // Update ref for next comparison
      prevSectionsRef.current = currentSections;
    }
  }, [sections]);

  const handleToggleSection = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isIncluded: !s.isIncluded } : s))
    );
  };

  const handleAddCustomSection = () => {
    const customSection: ExtendedSection = {
      id: `custom-${Date.now()}`,
      name: "Custom Section",
      emoji: "✨",
      content: `## Custom Section\n\nAdd your content here.`,
      isIncluded: true,
    };
    setSections([customSection, ...sections]);
  };

  const handleReset = () => {
    setIsResetModalOpen(true);
  };

  const confirmReset = () => {
    setSections((prev) => prev.map((s) => ({ ...s, isIncluded: false })));
    setFullMarkdown("");
    setIsResetModalOpen(false);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedSectionId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData("text/plain") || draggedSectionId;

    if (!sourceId || sourceId === targetId) return;

    const sourceIndex = sections.findIndex((s) => s.id === sourceId);
    const targetIndex = sections.findIndex((s) => s.id === targetId);

    if (sourceIndex === -1 || targetIndex === -1) return;

    const newSections = [...sections];
    const [removed] = newSections.splice(sourceIndex, 1);
    newSections.splice(targetIndex, 0, removed);

    setSections(newSections);
    setDraggedSectionId(null);
  };

  const handleDragEnd = () => {
    setDraggedSectionId(null);
  };

  const handleCopyRaw = async () => {
    try {
      await navigator.clipboard.writeText(fullMarkdown);
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 overflow-hidden">
      <SEO
        title="Readme Generator - Create Professional GitHub Readmes"
        description="Create beautiful, professional GitHub README.md files in seconds. Use our drag-and-drop editor with pre-built templates for badges, tech stack, and more."
        keywords="readme generator, github readme, markdown editor, developer tools, documentation generator"
      />
      {/* Unified Sidebar */}
      <div className="w-64 flex-none border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-slate-900 flex flex-col">
        <div className="p-2 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={handleAddCustomSection}
            className="w-full text-left px-3 py-2 rounded-md bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-600/20 transition-colors flex items-center gap-2 border border-blue-200 dark:border-blue-600/20"
          >
            <span>➕</span>
            <span className="font-medium text-sm">Custom Section</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sections.map((section) => (
            <div
              key={section.id}
              draggable
              onDragStart={(e) => handleDragStart(e, section.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, section.id)}
              onDragEnd={handleDragEnd}
              onClick={() => handleToggleSection(section.id)}
              className={`
                group relative flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer select-none transition-all
                hover:bg-gray-100 dark:hover:bg-gray-800/50
                ${draggedSectionId === section.id ? "opacity-50" : ""}
              `}
            >
              <span className="cursor-grab active:cursor-grabbing opacity-30 hover:opacity-100 text-gray-400">
                ⋮⋮
              </span>

              {/* Checkbox for inclusion status */}
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors
                  ${
                    section.isIncluded
                      ? "bg-green-500 border-green-500 text-white"
                      : "border-gray-400 text-transparent hover:border-gray-500"
                  }
                `}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleSection(section.id);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <span className="text-lg">{section.emoji}</span>
              <span
                className={`text-sm font-medium truncate flex-1 ${
                  section.isIncluded
                    ? "text-slate-900 dark:text-slate-100"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {section.name}
              </span>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-slate-900">
          <button
            onClick={handleReset}
            className="w-full px-3 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-900/30"
          >
            Reset / Clear All
          </button>
        </div>
      </div>

      {/* Middle & Right: Editor and Preview/Raw side by side */}
      <div className="flex-1 flex">
        {/* Left: Markdown Editor Only */}
        <div className="w-1/2 bg-gray-50 dark:bg-slate-900 h-full flex flex-col border-r border-gray-200 dark:border-gray-800">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-900">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
              Markdown Editor
            </h2>
          </div>
          <div className="flex-1 overflow-hidden">
            <div
              data-color-mode={isDarkMode ? "dark" : "light"}
              style={{ height: "100%" }}
            >
              <MDEditor
                value={fullMarkdown}
                onChange={setFullMarkdown}
                preview="edit"
                hideToolbar={false}
                height="100%"
                visibleDragbar={false}
                className="!border-0"
                textareaProps={{
                  style: {
                    // Let CSS handle background and color for proper syntax highlighting support
                    // backgroundColor: isDarkMode ? 'rgb(15 23 42)' : 'rgb(249 250 251)',
                    // color: isDarkMode ? 'rgb(241 245 249)' : 'rgb(15 23 42)',
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Right: Preview/Raw with Tabs */}
        <PreviewAndRaw markdown={fullMarkdown} />
      </div>

      <ConfirmationModal
        isOpen={isResetModalOpen}
        title="Reset All Sections"
        message="Are you sure you want to clear all sections? This action cannot be undone and will remove all your content."
        onConfirm={confirmReset}
        onCancel={() => setIsResetModalOpen(false)}
      />
    </div>
  );
};
