import { Clock, Copy, Check, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

import { ActionButton } from '@/components/common/ActionButton';
import { ToolHeader } from '@/components/common/ToolHeader';
import { ToolPageLayout } from '@/components/layouts/ToolPageLayout';

export const CronGenerator: React.FC = () => {
  const [minute, setMinute] = useState('*');
  const [hour, setHour] = useState('*');
  const [day, setDay] = useState('*');
  const [month, setMonth] = useState('*');
  const [week, setWeek] = useState('*');
  const [copied, setCopied] = useState(false);

  const expression = `${minute} ${hour} ${day} ${month} ${week}`;

  const humanReadable = () => {
    // Very basic descriptive text
    if (expression === '* * * * *') return 'Every minute';
    if (minute === '0' && hour === '*' && day === '*' && month === '*' && week === '*')
      return 'Every hour';
    if (minute === '0' && hour === '0' && day === '*' && month === '*' && week === '*')
      return 'At 00:00 every day';

    let desc = 'At ';
    if (minute !== '*' && hour !== '*') desc += `${hour}:${minute.padStart(2, '0')} `;
    else if (minute !== '*') desc += `minute ${minute} `;
    else desc += 'every minute ';

    if (day !== '*') desc += `on day ${day} of month `;
    if (week !== '*') desc += `on day of week ${week} `;

    return desc;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(expression);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setMinute('*');
    setHour('*');
    setDay('*');
    setMonth('*');
    setWeek('*');
    setCopied(false);
  };

  return (
    <ToolPageLayout>
      <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Clock}
          title="Cron Generator"
          description="Schedule tasks visually"
          iconBgColor="bg-success-light"
          iconColor="text-success"
        />

        {/* Toolbar */}
        <div className="p-3 bg-card border-b border-border flex justify-between items-center flex-wrap gap-2">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setMinute('*');
                setHour('*');
                setDay('*');
                setMonth('*');
                setWeek('*');
              }}
              className="px-3 py-1.5 bg-background-secondary border border-border rounded-lg text-xs font-medium hover:bg-background-secondary transition-colors"
            >
              Every Minute
            </button>
            <button
              onClick={() => {
                setMinute('0');
                setHour('*');
                setDay('*');
                setMonth('*');
                setWeek('*');
              }}
              className="px-3 py-1.5 bg-background-secondary border border-border rounded-lg text-xs font-medium hover:bg-background-secondary transition-colors"
            >
              Hourly
            </button>
            <button
              onClick={() => {
                setMinute('0');
                setHour('0');
                setDay('*');
                setMonth('*');
                setWeek('*');
              }}
              className="px-3 py-1.5 bg-background-secondary border border-border rounded-lg text-xs font-medium hover:bg-background-secondary transition-colors"
            >
              Daily (Midnight)
            </button>
            <button
              onClick={() => {
                setMinute('0');
                setHour('0');
                setDay('*');
                setMonth('*');
                setWeek('0');
              }}
              className="px-3 py-1.5 bg-background-secondary border border-border rounded-lg text-xs font-medium hover:bg-background-secondary transition-colors"
            >
              Weekly (Sunday)
            </button>
          </div>

          <button
            onClick={handleClear}
            className="p-2 text-foreground-muted hover:text-danger hover:bg-danger-light rounded-lg transition-colors"
            title="Reset"
          >
            <Trash2 size={20} />
          </button>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-background-secondary/30">
          <div className="h-full flex flex-col gap-6">
            {/* Result Display */}
            <div className="bg-background-dark rounded-2xl p-8 text-center relative group shadow-lg flex-shrink-0">
              <div className="text-4xl md:text-5xl font-mono font-bold text-foreground-inverse mb-3 tracking-widest">
                {expression}
              </div>
              <p className="text-foreground-muted font-medium">{humanReadable()}</p>
              <div className="absolute top-4 right-4">
                <ActionButton
                  icon={copied ? Check : Copy}
                  label={copied ? 'Copied' : 'Copy'}
                  onClick={handleCopy}
                  variant={copied ? 'success' : 'secondary'}
                  size="sm"
                />
              </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 flex-1 overflow-y-auto p-1">
              {[
                { label: 'Minute', val: minute, set: setMinute, range: '0-59' },
                { label: 'Hour', val: hour, set: setHour, range: '0-23' },
                { label: 'Day', val: day, set: setDay, range: '1-31' },
                { label: 'Month', val: month, set: setMonth, range: '1-12' },
                { label: 'Week', val: week, set: setWeek, range: '0-6 (Sun-Sat)' },
              ].map(field => (
                <div
                  key={field.label}
                  className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col"
                >
                  <label className="block text-xs font-bold text-foreground-muted uppercase mb-3 text-center tracking-wider">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    value={field.val}
                    onChange={e => field.set(e.target.value)}
                    className="w-full text-center p-3 bg-background-secondary border border-border rounded-lg font-mono font-bold text-xl text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all mb-auto"
                  />
                  <p className="text-xxs text-center text-foreground-muted mt-3 font-medium bg-background-secondary py-1 rounded-md">
                    {field.range}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
};
