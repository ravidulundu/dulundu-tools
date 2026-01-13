import MDEditor from '@uiw/react-md-editor';
import { HelpCircle } from 'lucide-react';
import React, { useState } from 'react';

import { SEO } from '@/components/SEO';
import { useTheme } from '@/hooks/useTheme';

import { ConfirmationModal } from './components/ConfirmationModal';
import { PreviewAndRaw } from './components/PreviewAndRaw';
import { SECTIONS, Section } from './data/sections';

import './MDEditor.css';

// Extended Section interface to track inclusion state
interface ExtendedSection extends Section {
  isIncluded: boolean;
  content: string; // Ensure content is always present
}

export const ReadmeGenerator = () => {
  // Get theme from ThemeProvider
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  // Initialize with all sections, but none included by default
  const [sections, setSections] = useState<ExtendedSection[]>(() => {
    return SECTIONS.map(s => ({
      ...s,
      isIncluded: false,
      content: s.content || '',
    }));
  });

  // Full markdown state - user can edit freely in MDEditor
  const [fullMarkdown, setFullMarkdown] = useState<string>('');
  const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Helper to update markdown based on sections
  const updateMarkdownFromSections = (currentSections: ExtendedSection[]) => {
    const combined = currentSections
      .filter(s => s.isIncluded)
      .map(s => s.content)
      .join('\n\n');
    setFullMarkdown(combined);
  };

  const handleToggleSection = (id: string) => {
    const newSections = sections.map(s => (s.id === id ? { ...s, isIncluded: !s.isIncluded } : s));
    setSections(newSections);
    updateMarkdownFromSections(newSections);
  };

  const handleAddCustomSection = () => {
    const customSection: ExtendedSection = {
      id: `custom-${Date.now()}`,
      name: 'Custom Section',
      emoji: '✨',
      content: `## Custom Section\n\nAdd your content here.`,
      isIncluded: true,
    };
    const newSections = [customSection, ...sections];
    setSections(newSections);
    updateMarkdownFromSections(newSections);
  };

  const handleReset = () => {
    setIsResetModalOpen(true);
  };

  const confirmReset = () => {
    const newSections = sections.map(s => ({ ...s, isIncluded: false }));
    setSections(newSections);
    setFullMarkdown('');
    setIsResetModalOpen(false);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedSectionId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('text/plain') || draggedSectionId;

    if (!sourceId || sourceId === targetId) return;

    const sourceIndex = sections.findIndex(s => s.id === sourceId);
    const targetIndex = sections.findIndex(s => s.id === targetId);

    if (sourceIndex === -1 || targetIndex === -1) return;

    const newSections = [...sections];
    const [removed] = newSections.splice(sourceIndex, 1);
    newSections.splice(targetIndex, 0, removed);

    setSections(newSections);
    updateMarkdownFromSections(newSections);
    setDraggedSectionId(null);
  };

  const handleDragEnd = () => {
    setDraggedSectionId(null);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-background-secondary text-foreground overflow-hidden">
      <SEO
        title="Readme Generator - Create Professional GitHub Readmes"
        description="Create beautiful, professional GitHub README.md files in seconds. Use our drag-and-drop editor with pre-built templates for badges, tech stack, and more."
        keywords="readme generator, github readme, markdown editor, developer tools, documentation generator"
      />
      {/* Unified Sidebar */}
      <div className="w-64 flex-none border-r border-border bg-background-secondary flex flex-col">
        <div className="p-2 border-b border-border">
          <button
            onClick={handleAddCustomSection}
            className="w-full text-left px-3 py-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-2 border border-primary/20"
          >
            <span>➕</span>
            <span className="font-medium text-sm">Custom Section</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sections.map(section => (
            <div
              key={section.id}
              draggable
              onDragStart={e => handleDragStart(e, section.id)}
              onDragOver={handleDragOver}
              onDrop={e => handleDrop(e, section.id)}
              onDragEnd={handleDragEnd}
              onClick={() => handleToggleSection(section.id)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleToggleSection(section.id);
                }
              }}
              role="button"
              tabIndex={0}
              className={`
                group relative flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer select-none transition-all
                hover:bg-background-secondary/80
                ${draggedSectionId === section.id ? 'opacity-50' : ''}
              `}
            >
              <span className="cursor-grab active:cursor-grabbing opacity-30 hover:opacity-100 text-foreground-muted">
                ⋮⋮
              </span>

              {/* Checkbox for inclusion status */}
              <div
                role="checkbox"
                aria-checked={section.isIncluded}
                tabIndex={0}
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors
                  ${
                    section.isIncluded
                      ? 'bg-success border-success text-white'
                      : 'border-border text-transparent hover:border-foreground-muted'
                  }
                `}
                onClick={e => {
                  e.stopPropagation();
                  handleToggleSection(section.id);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation();
                    handleToggleSection(section.id);
                  }
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
                  section.isIncluded ? 'text-foreground' : 'text-foreground-muted'
                }`}
              >
                {section.name}
              </span>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-border bg-background-secondary">
          <button
            onClick={handleReset}
            className="w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors border border-transparent hover:border-destructive/20"
          >
            Reset / Clear All
          </button>
        </div>
      </div>

      {/* Middle & Right: Editor and Preview/Raw side by side */}
      <div className="flex-1 flex">
        {/* Left: Markdown Editor Only */}
        <div className="w-1/2 bg-background-secondary h-full flex flex-col border-r border-border">
          <div className="p-4 border-b border-border bg-background-secondary flex justify-between items-center">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Markdown Editor
            </h2>
            <a
              href="https://www.markdownguide.org/basic-syntax/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline flex items-center gap-1"
              title="View Markdown Syntax Guide"
            >
              <HelpCircle size={14} />
              Syntax Guide
            </a>
          </div>
          <div className="flex-1 overflow-hidden">
            <div data-color-mode={isDarkMode ? 'dark' : 'light'} style={{ height: '100%' }}>
              <MDEditor
                value={fullMarkdown}
                onChange={val => setFullMarkdown(val || '')}
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
