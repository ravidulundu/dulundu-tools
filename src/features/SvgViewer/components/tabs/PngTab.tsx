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
        className="flex-1 w-full h-full flex items-center justify-center overflow-hidden relative cursor-grab active:cursor-grabbing"
        style={{
          ...(background === 'checkerboard'
            ? {
                backgroundImage: `linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)`,
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                backgroundColor: '#ffffff',
              }
            : { backgroundColor: background }),
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
            <div className="flex items-center justify-center text-xs text-gray-400">
              Generating...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
