
import React, { useState } from 'react';
import { Lock, Shield, User, Users, Globe } from 'lucide-react';

export const ChmodCalculator: React.FC = () => {
  const [permissions, setPermissions] = useState({
    owner: { r: true, w: true, x: true }, // 7
    group: { r: true, w: false, x: true }, // 5
    public: { r: true, w: false, x: true } // 5
  });

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
        [type]: !prev[scope][type]
      }
    }));
  };

  const setFromOctal = (octal: string) => {
     if (!/^[0-7]{3}$/.test(octal)) return;
     const decode = (n: number) => ({ r: (n & 4) !== 0, w: (n & 2) !== 0, x: (n & 1) !== 0 });
     setPermissions({
        owner: decode(parseInt(octal[0])),
        group: decode(parseInt(octal[1])),
        public: decode(parseInt(octal[2]))
     });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center space-x-3 bg-slate-50/50">
           <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
              <Lock size={24} />
           </div>
           <div>
              <h1 className="text-2xl font-bold text-slate-800">Chmod Calculator</h1>
              <p className="text-sm text-slate-500">Calculate Linux file permissions</p>
           </div>
        </div>

        <div className="p-8">
           <div className="grid md:grid-cols-3 gap-8 mb-10">
              {[
                { id: 'owner', label: 'Owner', icon: User, color: 'text-blue-600', bg: 'bg-blue-50' },
                { id: 'group', label: 'Group', icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
                { id: 'public', label: 'Public', icon: Globe, color: 'text-purple-600', bg: 'bg-purple-50' }
              ].map((scope) => (
                 <div key={scope.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <div className={`flex items-center mb-4 ${scope.color}`}>
                       <scope.icon size={20} className="mr-2" />
                       <span className="font-bold">{scope.label}</span>
                    </div>
                    <div className="space-y-3">
                       <label className="flex items-center cursor-pointer select-none group">
                          <input 
                            type="checkbox" 
                            checked={permissions[scope.id as keyof typeof permissions].r} 
                            onChange={() => updatePermission(scope.id as any, 'r')}
                            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/50"
                          />
                          <span className="ml-3 text-slate-700 font-medium group-hover:text-primary transition-colors">Read (4)</span>
                       </label>
                       <label className="flex items-center cursor-pointer select-none group">
                          <input 
                            type="checkbox" 
                            checked={permissions[scope.id as keyof typeof permissions].w} 
                            onChange={() => updatePermission(scope.id as any, 'w')}
                            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/50"
                          />
                          <span className="ml-3 text-slate-700 font-medium group-hover:text-primary transition-colors">Write (2)</span>
                       </label>
                       <label className="flex items-center cursor-pointer select-none group">
                          <input 
                            type="checkbox" 
                            checked={permissions[scope.id as keyof typeof permissions].x} 
                            onChange={() => updatePermission(scope.id as any, 'x')}
                            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/50"
                          />
                          <span className="ml-3 text-slate-700 font-medium group-hover:text-primary transition-colors">Execute (1)</span>
                       </label>
                    </div>
                 </div>
              ))}
           </div>

           <div className="bg-slate-900 text-white rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                 <p className="text-slate-400 text-sm uppercase font-bold tracking-wider mb-2">Octal Value</p>
                 <input 
                   type="text" 
                   value={getOctal()}
                   onChange={(e) => setFromOctal(e.target.value)}
                   className="bg-transparent text-5xl font-mono font-bold text-white outline-none w-32 text-center md:text-left border-b-2 border-slate-700 focus:border-primary transition-colors"
                   maxLength={3}
                 />
              </div>

              <div className="h-12 w-px bg-slate-700 hidden md:block"></div>

              <div className="text-center md:text-right">
                 <p className="text-slate-400 text-sm uppercase font-bold tracking-wider mb-2">Symbolic Value</p>
                 <div className="text-4xl font-mono font-bold text-green-400 tracking-wider">
                    {getSymbolic()}
                 </div>
              </div>
           </div>
           
           <div className="mt-6 p-4 bg-yellow-50 text-yellow-800 rounded-xl border border-yellow-100 text-sm">
              <span className="font-bold">Command:</span> <code>chmod {getOctal()} filename.txt</code>
           </div>
        </div>
      </div>
    </div>
  );
};
