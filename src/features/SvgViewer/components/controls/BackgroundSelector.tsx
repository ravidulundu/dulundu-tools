import clsx from 'clsx';
import React from 'react';

interface BackgroundSelectorProps {
  currentBackground: 'white' | 'transparent' | 'black' | 'checkerboard';
  onChange: (bg: 'white' | 'transparent' | 'black' | 'checkerboard') => void;
}

export const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  currentBackground,
  onChange,
}) => {
  const backgrounds: Array<'white' | 'transparent' | 'black' | 'checkerboard'> = [
    'white',
    'transparent',
    'black',
    'checkerboard',
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-foreground-muted mr-2">Background:</span>
      {backgrounds.map(bg => (
        <button
          key={bg}
          onClick={() => onChange(bg)}
          className={clsx(
            'w-6 h-6 rounded border-2 transition-all',
            currentBackground === bg
              ? 'border-primary ring-2 ring-primary/20'
              : 'border-border hover:border-border'
          )}
          title={bg}
        >
          {bg === 'white' && <div className="w-full h-full bg-white rounded-sm" />}
          {bg === 'black' && <div className="w-full h-full bg-black rounded-sm" />}
          {bg === 'transparent' && (
            <div className="w-full h-full bg-background-secondary rounded-sm" />
          )}
          {bg === 'checkerboard' && (
            <div
              className="w-full h-full rounded-sm bg-checkerboard"
              /* Checkerboard pattern from global CSS */
            />
          )}
        </button>
      ))}
    </div>
  );
};
