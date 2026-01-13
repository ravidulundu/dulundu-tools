import { useCallback, useEffect, useMemo, useState } from 'react';

const PRESETS_KEY = 'dulundu-tool-presets';

export interface Preset<T = unknown> {
  id: string;
  name: string;
  toolId: string;
  settings: T;
  createdAt: number;
}

type PresetsStore = Record<string, Preset<unknown>[]>;

function loadPresets(): PresetsStore {
  try {
    const stored = localStorage.getItem(PRESETS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function savePresets(presets: PresetsStore): void {
  try {
    localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
  } catch {
    // Storage full or unavailable
  }
}

export function useToolPresets<T>(toolId: string) {
  const [allPresets, setAllPresets] = useState<PresetsStore>(loadPresets);

  // Get presets for this tool
  const presets = useMemo(() => (allPresets[toolId] || []) as Preset<T>[], [allPresets, toolId]);

  // Persist on change
  useEffect(() => {
    savePresets(allPresets);
  }, [allPresets]);

  const addPreset = useCallback(
    (name: string, settings: T): Preset<T> => {
      const newPreset: Preset<T> = {
        id: crypto.randomUUID(),
        name,
        toolId,
        settings,
        createdAt: Date.now(),
      };

      setAllPresets(prev => ({
        ...prev,
        [toolId]: [...(prev[toolId] || []), newPreset],
      }));

      return newPreset;
    },
    [toolId]
  );

  const updatePreset = useCallback(
    (presetId: string, settings: T) => {
      setAllPresets(prev => ({
        ...prev,
        [toolId]: (prev[toolId] || []).map(p => (p.id === presetId ? { ...p, settings } : p)),
      }));
    },
    [toolId]
  );

  const deletePreset = useCallback(
    (presetId: string) => {
      setAllPresets(prev => ({
        ...prev,
        [toolId]: (prev[toolId] || []).filter(p => p.id !== presetId),
      }));
    },
    [toolId]
  );

  const renamePreset = useCallback(
    (presetId: string, name: string) => {
      setAllPresets(prev => ({
        ...prev,
        [toolId]: (prev[toolId] || []).map(p => (p.id === presetId ? { ...p, name } : p)),
      }));
    },
    [toolId]
  );

  const getPreset = useCallback(
    (presetId: string): Preset<T> | undefined => {
      return presets.find(p => p.id === presetId);
    },
    [presets]
  );

  return {
    presets,
    addPreset,
    updatePreset,
    deletePreset,
    renamePreset,
    getPreset,
  };
}
