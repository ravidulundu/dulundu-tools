import { Lock, User, Users, Globe, Copy, Check, RefreshCw } from 'lucide-react';
import React, { useState } from 'react';

import { ActionButton } from '@/components/common/ActionButton';
import { ToolHeader } from '@/components/common/ToolHeader';

export const ChmodCalculator: React.FC = () => {
  const [permissions, setPermissions] = useState({
    owner: { r: true, w: true, x: true }, // 7
    group: { r: true, w: false, x: true }, // 5
    public: { r: true, w: false, x: true }, // 5
  });
  const [copied, setCopied] = useState(false);

  const getOctal = () => {
    const calc = (p: any) => (p.r ? 4 : 0) + (p.w ? 2 : 0) + (p.x ? 1 : 0);
    return `${calc(permissions.owner)}${calc(permissions.group)}${calc(permissions.public)}`;
  };

  const getSymbolic = () => {
    const sym = (p: any) => `${p.r ? 'r' : '-'}${p.w ? 'w' : '-'}${p.x ? 'x' : '-'}`;
    return `-${sym(permissions.owner)}${sym(permissions.group)}${sym(permissions.public)}`;
  };

  const updatePermission = (scope: 'owner' | 'group' | 'public', type: 'r' | 'w' | 'x') => {
    setPermissions(prev => ({
      ...prev,
      [scope]: {
        ...prev[scope],
        [type]: !prev[scope][type],
      },
    }));
  };

  const setFromOctal = (octal: string) => {
    if (!/^[0-7]{3}$/.test(octal)) return;
    const decode = (n: number) => ({ r: (n & 4) !== 0, w: (n & 2) !== 0, x: (n & 1) !== 0 });
    setPermissions({
      owner: decode(parseInt(octal[0])),
      group: decode(parseInt(octal[1])),
      public: decode(parseInt(octal[2])),
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`chmod ${getOctal()} filename.txt`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setPermissions({
      owner: { r: true, w: true, x: true },
      group: { r: true, w: false, x: true },
      public: { r: true, w: false, x: true },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Lock}
          title="Chmod Calculator"
          description="Calculate Linux file permissions"
          iconBgColor="bg-orange-100"
          iconColor="text-orange-600"
        />

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex justify-end">
          <button
            onClick={reset}
            className="flex items-center space-x-2 px-3 py-1.5 bg-slate-50 border border-gray-200 rounded-lg text-sm font-medium hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <RefreshCw size={16} /> <span>Reset Default</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  id: 'owner',
                  label: 'Owner',
                  icon: User,
                  color: 'text-blue-600',
                  bg: 'bg-blue-50',
                },
                {
                  id: 'group',
                  label: 'Group',
                  icon: Users,
                  color: 'text-green-600',
                  bg: 'bg-green-50',
                },
                {
                  id: 'public',
                  label: 'Public',
                  icon: Globe,
                  color: 'text-purple-600',
                  bg: 'bg-purple-50',
                },
              ].map(scope => (
                <div
                  key={scope.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className={`flex items-center mb-5 ${scope.color}`}>
                    <scope.icon size={20} className="mr-2" />
                    <span className="font-bold text-lg">{scope.label}</span>
                  </div>
                  <div className="space-y-4">
                    <label className="flex items-center cursor-pointer select-none group p-2 hover:bg-slate-50 rounded-lg transition-colors -mx-2">
                      <input
                        type="checkbox"
                        checked={permissions[scope.id as keyof typeof permissions].r}
                        onChange={() => updatePermission(scope.id as any, 'r')}
                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/50 cursor-pointer"
                      />
                      <span className="ml-3 text-slate-700 font-medium group-hover:text-primary transition-colors">
                        Read (4)
                      </span>
                    </label>
                    <label className="flex items-center cursor-pointer select-none group p-2 hover:bg-slate-50 rounded-lg transition-colors -mx-2">
                      <input
                        type="checkbox"
                        checked={permissions[scope.id as keyof typeof permissions].w}
                        onChange={() => updatePermission(scope.id as any, 'w')}
                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/50 cursor-pointer"
                      />
                      <span className="ml-3 text-slate-700 font-medium group-hover:text-primary transition-colors">
                        Write (2)
                      </span>
                    </label>
                    <label className="flex items-center cursor-pointer select-none group p-2 hover:bg-slate-50 rounded-lg transition-colors -mx-2">
                      <input
                        type="checkbox"
                        checked={permissions[scope.id as keyof typeof permissions].x}
                        onChange={() => updatePermission(scope.id as any, 'x')}
                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/50 cursor-pointer"
                      />
                      <span className="ml-3 text-slate-700 font-medium group-hover:text-primary transition-colors">
                        Execute (1)
                      </span>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-900 text-white rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Lock size={120} />
              </div>

              <div className="text-center md:text-left z-10">
                <p className="text-slate-400 text-sm uppercase font-bold tracking-wider mb-2">
                  Octal Value
                </p>
                <input
                  type="text"
                  value={getOctal()}
                  onChange={e => setFromOctal(e.target.value)}
                  className="bg-transparent text-6xl font-mono font-bold text-white outline-none w-32 text-center md:text-left border-b-2 border-slate-700 focus:border-primary transition-colors"
                  maxLength={3}
                />
              </div>

              <div className="h-16 w-px bg-slate-700 hidden md:block z-10"></div>

              <div className="text-center md:text-right z-10">
                <p className="text-slate-400 text-sm uppercase font-bold tracking-wider mb-2">
                  Symbolic Value
                </p>
                <div className="text-4xl font-mono font-bold text-green-400 tracking-wider">
                  {getSymbolic()}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-3 overflow-hidden">
                <span className="font-bold text-slate-700 whitespace-nowrap">Command:</span>
                <code className="bg-slate-100 px-3 py-1.5 rounded-lg text-slate-800 font-mono text-sm truncate">
                  chmod {getOctal()} filename.txt
                </code>
              </div>
              <ActionButton
                icon={copied ? Check : Copy}
                label={copied ? 'Copied' : 'Copy'}
                onClick={handleCopy}
                variant={copied ? 'success' : 'primary'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
