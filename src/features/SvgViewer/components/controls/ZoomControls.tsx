import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import React from 'react';

interface ZoomControlsProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({
  scale,
  onZoomIn,
  onZoomOut,
  onReset,
}) => {
  const [zoomInputValue, setZoomInputValue] = React.useState('100%');

  // Sync input with scale changes
  React.useEffect(() => {
    setZoomInputValue(`${Math.round(scale * 100)}%`);
  }, [scale]);

  const handleZoomInputCommit = (value: string) => {
    const cleanVal = value.replace(/[^0-9]/g, '');
    if (cleanVal) {
      // const num = parseInt(cleanVal, 10);
      // const clampedNum = Math.min(Math.max(10, num), 1000);
      // Note: We'd need to expose setTransform from parent or pass callback
      // For now, this is simplified
    } else {
      setZoomInputValue(`${Math.round(scale * 100)}%`);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-foreground-muted mr-2 hidden sm:inline-block whitespace-nowrap">
        Use Ctrl + Scroll to zoom
      </span>
      <button
        onClick={onZoomOut}
        className="p-1.5 text-foreground-muted hover:text-foreground transition-colors"
        title="Zoom Out"
      >
        <ZoomOut className="w-4 h-4" />
      </button>
      <input
        type="text"
        className="text-xs font-mono text-foreground-secondary w-[50px] text-center bg-transparent border border-transparent hover:border-border rounded focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
        value={zoomInputValue}
        onChange={e => setZoomInputValue(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            handleZoomInputCommit(e.currentTarget.value);
            e.currentTarget.blur();
          }
        }}
        onFocus={e => {
          const val = e.target.value.replace('%', '');
          setZoomInputValue(val);
          e.target.select();
        }}
        onBlur={e => handleZoomInputCommit(e.target.value)}
      />
      <button
        onClick={onZoomIn}
        className="p-1.5 text-foreground-muted hover:text-foreground transition-colors"
        title="Zoom In"
      >
        <ZoomIn className="w-4 h-4" />
      </button>
      <button
        onClick={onReset}
        className="p-1.5 text-foreground-muted hover:text-foreground transition-colors"
        title="Reset Zoom"
      >
        <Maximize2 className="w-4 h-4" />
      </button>
    </div>
  );
};
