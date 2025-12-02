
import { useEffect, useState } from 'react';

export interface HoverInfo {
  lineNumber: number;
  elementType: string;
  elementIndex: number;
}

export const useEditorHover = (editor: any) => {
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);

  useEffect(() => {
    if (!editor) return;

    // Listen to mouse move events for hover effect
    const disposable = editor.onMouseMove((e: any) => {
      // Check if we have a target position (hovering over text)
      if (e.target && e.target.position) {
        const lineNumber = e.target.position.lineNumber;
        const model = editor.getModel();
        if (!model) return;

        // Get content of the hovered line
        const lineContent = model.getLineContent(lineNumber);
        
        const column = e.target.position.column;
        
        // Find all SVG tags on this line
        const tagRegex = /<(path|circle|rect|ellipse|polygon|polyline|line|g|text|use|image|defs|symbol|marker|mask|pattern|clipPath|linearGradient|radialGradient|stop)[^>]*>/gi;
        let match;
        let foundElement = null;

        // Iterate through all matches on the line to find which one the cursor is over
        while ((match = tagRegex.exec(lineContent)) !== null) {
          const startCol = match.index + 1; // 1-based column
          const endCol = startCol + match[0].length;
          
          if (column >= startCol && column <= endCol) {
            foundElement = {
              type: match[1].toLowerCase(),
              index: match.index
            };
            break;
          }
        }
        
        if (foundElement) {
          const elementType = foundElement.type;
          
          // Calculate element index (global nth-of-type)
          // Get text up to the start of this specific element instance
          const lineStartOffset = model.getOffsetAt({ lineNumber: lineNumber, column: 1 });
          const elementStartOffset = lineStartOffset + foundElement.index;
          
          const fullText = model.getValue();
          const textBefore = fullText.substring(0, elementStartOffset);
          
          // Remove comments to avoid false counts
          const textBeforeNoComments = textBefore.replace(/<!--[\s\S]*?-->/g, '');
          
          const regex = new RegExp(`<${elementType}[^>]*>`, 'gi');
          const matches = textBeforeNoComments.match(regex);
          const elementIndex = matches ? matches.length : 0;

          // console.log('Hover detected:', { lineNumber, elementType, elementIndex });

          setHoverInfo({
            lineNumber,
            elementType,
            elementIndex,
          });
        } else {
          setHoverInfo(null);
        }
      } else {
        setHoverInfo(null);
      }
    });

    return () => {
      disposable?.dispose();
    };
  }, [editor]);

  return hoverInfo;
};
