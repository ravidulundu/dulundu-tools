import clsx from 'clsx';
import { Minus, Plus, Download, Copy } from 'lucide-react';
import React from 'react';

import { useSVG } from '../hooks/useSVG';

const BottomBar = () => {
  const { scale, setScale, background, setBackground } = useSVG();

  return (
    <div className="h-14 bg-card border-t border-border flex items-center justify-between px-4">
      {/* Left: Zoom Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setScale(Math.max(0.1, scale - 0.1))}
          className="p-2 hover:bg-background-secondary rounded-md transition-colors"
        >
          <Minus className="w-4 h-4 text-foreground-muted" />
        </button>
        <span className="text-sm font-medium text-foreground-secondary min-w-[3rem] text-center">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={() => setScale(Math.min(4, scale + 0.1))}
          className="p-2 hover:bg-background-secondary rounded-md transition-colors"
        >
          <Plus className="w-4 h-4 text-foreground-muted" />
        </button>
      </div>

      {/* Center: Background Toggles */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setBackground('white')}
          className={clsx(
            'w-6 h-6 rounded border transition-all',
            background === 'white'
              ? 'border-primary ring-2 ring-primary/20'
              : 'border-border bg-white'
          )}
          title="White Background"
        />
        <button
          onClick={() => setBackground('transparent')}
          className={clsx(
            'w-6 h-6 rounded border transition-all bg-background-secondary',
            background === 'transparent'
              ? 'border-primary ring-2 ring-primary/20'
              : 'border-border'
          )}
          title="Transparent Background"
        />
        <button
          onClick={() => setBackground('black')}
          className={clsx(
            'w-6 h-6 rounded border transition-all bg-black',
            background === 'black' ? 'border-primary ring-2 ring-primary/20' : 'border-border'
          )}
          title="Black Background"
        />
        <button
          onClick={() => setBackground('checkerboard')}
          className={clsx(
            'w-6 h-6 rounded border transition-all',
            background === 'checkerboard'
              ? 'border-primary ring-2 ring-primary/20'
              : 'border-border'
          )}
          style={{
            backgroundImage: `linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)`,
            backgroundSize: '8px 8px',
            backgroundColor: 'white',
          }}
          title="Checkerboard Background"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-foreground-secondary hover:bg-background-secondary rounded-md transition-colors">
          <Copy className="w-4 h-4" />
          Copy
        </button>
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-md transition-colors shadow-sm">
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>
    </div>
  );
};

export default BottomBar;
