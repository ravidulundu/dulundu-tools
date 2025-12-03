import { Copy } from 'lucide-react';
import React from 'react';

import { generateDataUris, formatBytes } from '../../utils/svgExporter';

interface DataUriTabProps {
  svgCode: string;
}

export const DataUriTab: React.FC<DataUriTabProps> = ({ svgCode }) => {
  return (
    <div className="w-full h-full bg-white p-6 overflow-y-auto">
      <div className="flex flex-col gap-8 w-full">
        {Object.entries(generateDataUris(svgCode)).map(([key, data]) => (
          <div key={key} className="flex flex-col gap-3 w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-900">{data.label}</span>
                <span className="text-sm text-gray-400">{formatBytes(data.size)}</span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(data.value);
                }}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Copy
              </button>
            </div>
            <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 font-mono text-xs text-gray-600 break-all shadow-sm">
              {data.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
