import DOMPurify from 'dompurify';
import React, { useState, useEffect } from 'react';

import { getIconSvg } from '../../services/iconify';

interface IconGridProps {
  icons: string[];
  onSelectIcon: (svgCode: string) => void;
}

export const IconGrid: React.FC<IconGridProps> = ({ icons, onSelectIcon }) => {
  const [loadedIcons, setLoadedIcons] = React.useState<Record<string, string>>({});

  // Lazy load SVGs for the grid
  // In a real virtualized list, we would only load visible ones.
  // For this simple grid, we fetch them as they appear in the list.
  React.useEffect(() => {
    let active = true;

    const loadIcons = async () => {
      const newIcons: Record<string, string> = {};
      // Fetch in batches or individually
      // For performance, we'll just fetch the ones we don't have yet
      const iconsToFetch = icons.filter(icon => !loadedIcons[icon]);

      if (iconsToFetch.length === 0) return;

      // Limit concurrent requests
      const batch = iconsToFetch.slice(0, 20);

      await Promise.all(
        batch.map(async iconName => {
          try {
            const svg = await getIconSvg(iconName);
            if (active) {
              setLoadedIcons(prev => ({ ...prev, [iconName]: svg }));
            }
          } catch (e) {
            console.error(`Failed to load icon ${iconName}`, e);
          }
        })
      );
    };

    loadIcons();

    return () => {
      active = false;
    };
  }, [icons, loadedIcons]);

  if (icons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-gray-500 dark:text-gray-500 text-sm">
        <p>No icons found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2 p-1">
      {icons.map(iconName => (
        <button
          key={iconName}
          draggable={!!loadedIcons[iconName]}
          onDragStart={e => {
            if (loadedIcons[iconName]) {
              e.dataTransfer.setData('text/plain', loadedIcons[iconName]);
              e.dataTransfer.effectAllowed = 'copy';
            }
          }}
          onClick={() => loadedIcons[iconName] && onSelectIcon(loadedIcons[iconName])}
          className="aspect-square flex items-center justify-center bg-gray-100 dark:bg-[#252526] hover:bg-gray-200 dark:hover:bg-[#2d2d2e] border border-transparent hover:border-blue-500/50 rounded transition-all group relative cursor-grab active:cursor-grabbing"
          title={iconName}
        >
          {loadedIcons[iconName] ? (
            <div
              className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current pointer-events-none"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(loadedIcons[iconName]),
              }}
            />
          ) : (
            <div className="w-6 h-6 bg-gray-800/50 rounded animate-pulse" />
          )}
        </button>
      ))}
    </div>
  );
};
