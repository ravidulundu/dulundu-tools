import { Monitor, Cpu, Globe, RefreshCw, Search } from 'lucide-react';
import React, { useState } from 'react';
import UAParser from 'ua-parser-js';

import { ToolHeader } from '@/components/common/ToolHeader';

export const UaParser: React.FC = () => {
  const [uaString, setUaString] = useState(navigator.userAgent);
  const [result, setResult] = useState<UAParser.IResult | null>(() => {
    return new UAParser(navigator.userAgent).getResult();
  });

  const parse = React.useCallback(() => {
    const parser = new UAParser(uaString);
    setResult(parser.getResult());
  }, [uaString]);

  const setToCurrent = () => {
    setUaString(navigator.userAgent);
    // Use timeout to ensure state update is processed
    setTimeout(() => {
      const parser = new UAParser(navigator.userAgent);
      setResult(parser.getResult());
    }, 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Monitor}
          title="User Agent Parser"
          description="Decode browser user agent strings"
        />

        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-background-secondary/30 flex flex-col">
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm mb-6">
            <label htmlFor="ua-input" className="block text-sm font-bold text-foreground-secondary mb-2">
              User Agent String
            </label>
            <div className="flex gap-2">
              <input
                id="ua-input"
                type="text"
                value={uaString}
                onChange={e => setUaString(e.target.value)}
                className="flex-1 p-3 bg-background-secondary border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-sm text-foreground-secondary"
                placeholder="Paste User Agent string here..."
              />
              <button
                onClick={parse}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 font-bold shadow-sm flex items-center"
              >
                <Search size={18} className="mr-2" /> Parse
              </button>
            </div>
            <button
              onClick={setToCurrent}
              className="mt-2 text-xs font-medium text-primary hover:text-primary/80 hover:underline flex items-center"
            >
              <RefreshCw size={12} className="mr-1" /> Use my current User Agent
            </button>
          </div>

          {result && (
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="grid md:grid-cols-3 gap-6 animate-fade-in pb-4">
                <InfoCard
                  icon={Globe}
                  title="Browser"
                  data={[
                    { label: 'Name', value: result.browser.name || 'N/A' },
                    { label: 'Version', value: result.browser.version || 'N/A' },
                    { label: 'Major', value: result.browser.major || 'N/A' },
                  ]}
                />
                <InfoCard
                  icon={Monitor}
                  title="OS"
                  data={[
                    { label: 'Name', value: result.os.name || 'N/A' },
                    { label: 'Version', value: result.os.version || 'N/A' },
                  ]}
                />
                <InfoCard
                  icon={Cpu}
                  title="Device"
                  data={[
                    { label: 'Vendor', value: result.device.vendor || 'N/A' },
                    { label: 'Model', value: result.device.model || 'N/A' },
                    { label: 'Type', value: result.device.type || 'Desktop' },
                    { label: 'CPU', value: result.cpu.architecture || 'N/A' },
                  ]}
                />

                <div className="col-span-full bg-card rounded-xl p-6 border border-border shadow-sm">
                  <h3 className="font-bold text-foreground-secondary mb-4 border-b border-border pb-2 flex items-center">
                    <Monitor size={18} className="mr-2 text-foreground-muted" /> Engine Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-foreground-muted uppercase font-bold tracking-wider">
                        Name
                      </span>
                      <p className="font-mono text-foreground mt-1 bg-background-secondary p-2 rounded border border-border">
                        {result.engine.name || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-foreground-muted uppercase font-bold tracking-wider">
                        Version
                      </span>
                      <p className="font-mono text-foreground mt-1 bg-background-secondary p-2 rounded border border-border">
                        {result.engine.version || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InfoCard: React.FC<{
  icon: React.ElementType;
  title: string;
  data: { label: string; value: string }[];
}> = ({ icon: Icon, title, data }) => (
  <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center space-x-2 mb-4 border-b border-border pb-2">
      <div className="p-1.5 bg-background-secondary rounded-lg text-foreground-muted">
        <Icon size={18} />
      </div>
      <h3 className="font-bold text-foreground-secondary">{title}</h3>
    </div>
    <div className="space-y-3">
      {data.map((item, i) => (
        <div key={i} className="flex justify-between items-center">
          <span className="text-sm text-foreground-muted font-medium">{item.label}</span>
          <span className="text-sm font-bold text-foreground bg-background-secondary px-2 py-0.5 rounded border border-border">
            {item.value || 'N/A'}
          </span>
        </div>
      ))}
    </div>
  </div>
);
