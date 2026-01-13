import clsx from 'clsx';
import React from 'react';

interface PngTabProps {
  pngDataUri: string | null;
  background: string;
  transform: { x: number; y: number; scale: number };
  containerRef: React.RefObject<HTMLDivElement>;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: (e: React.MouseEvent) => void;
  onMouseLeave: (e: React.MouseEvent) => void;
}

export const PngTab: React.FC<PngTabProps> = ({
  pngDataUri,
  background,
  transform,
  containerRef,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
}) => {
  return (
    <div className="w-full h-full flex flex-col relative">
      <div
        role="button"
        aria-label="PNG Preview"
        tabIndex={0}
        className={clsx(
          'flex-1 w-full h-full flex items-center justify-center overflow-hidden relative cursor-grab active:cursor-grabbing',
          background === 'checkerboard' && 'bg-checkerboard'
        )}
        style={{
          ...(background !== 'checkerboard' ? { backgroundColor: background } : {}),
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onKeyDown={_e => {}} // Dummy handler for now
        ref={containerRef}
      >
        <div
          className="relative transition-transform duration-75 ease-out origin-center will-change-transform"
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          }}
        >
          {pngDataUri ? (
            <img src={pngDataUri} alt="Preview" className="block shadow-sm" draggable={false} />
          ) : (
            <div className="flex items-center justify-center text-xs text-foreground-muted">
              Generating...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
