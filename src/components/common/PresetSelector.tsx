import { Save, Trash2, ChevronDown, Plus } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

import { Preset } from '@/hooks/useToolPresets';

interface PresetSelectorProps<T> {
  presets: Preset<T>[];
  onSelect: (preset: Preset<T>) => void;
  onSave: (name: string) => void;
  onDelete: (presetId: string) => void;
}

export function PresetSelector<T>({ presets, onSelect, onSave, onDelete }: PresetSelectorProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setShowSaveInput(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when showing save form
  useEffect(() => {
    if (showSaveInput) {
      inputRef.current?.focus();
    }
  }, [showSaveInput]);

  const handleSave = () => {
    if (newPresetName.trim()) {
      onSave(newPresetName.trim());
      setNewPresetName('');
      setShowSaveInput(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-background-secondary hover:bg-background-tertiary border border-border rounded-lg text-sm text-foreground-secondary transition-colors"
      >
        <Save size={14} />
        <span>Presets</span>
        {presets.length > 0 && (
          <span className="px-1.5 py-0.5 bg-primary/20 text-primary text-xs rounded">
            {presets.length}
          </span>
        )}
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-64 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-scale-in">
          {/* Save new preset */}
          {showSaveInput ? (
            <div className="p-3 border-b border-border">
              <input
                ref={inputRef}
                type="text"
                value={newPresetName}
                onChange={e => setNewPresetName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') setShowSaveInput(false);
                }}
                placeholder="Preset name..."
                className="w-full px-3 py-2 bg-background-secondary border border-border rounded-lg text-sm outline-none focus:border-primary"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleSave}
                  disabled={!newPresetName.trim()}
                  className="flex-1 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowSaveInput(false)}
                  className="px-3 py-1.5 bg-background-secondary text-foreground-muted text-xs font-medium rounded-lg hover:bg-background-tertiary"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowSaveInput(true)}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-primary hover:bg-primary-light transition-colors border-b border-border"
            >
              <Plus size={16} />
              Save Current Settings
            </button>
          )}

          {/* Preset list */}
          <div className="max-h-48 overflow-y-auto">
            {presets.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-foreground-muted">
                No saved presets yet
              </div>
            ) : (
              presets.map(preset => (
                <div
                  key={preset.id}
                  className="flex items-center justify-between px-4 py-2 hover:bg-background-secondary group"
                >
                  <button
                    onClick={() => {
                      onSelect(preset);
                      setIsOpen(false);
                    }}
                    className="flex-1 text-left text-sm text-foreground truncate"
                  >
                    {preset.name}
                  </button>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onDelete(preset.id);
                    }}
                    className="p-1 text-foreground-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete preset"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
