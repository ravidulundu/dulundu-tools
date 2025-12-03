import { Lock, RefreshCw, Check, AlertTriangle, Copy, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

// bcryptjs lazy loaded
import { ActionButton } from '@/components/common/ActionButton';
import { CodeEditor } from '@/components/common/CodeEditor';
import { ToolHeader } from '@/components/common/ToolHeader';

export const BcryptGenerator: React.FC = () => {
  const [password, setPassword] = useState('');
  const [rounds, setRounds] = useState(10);
  const [hash, setHash] = useState('');
  const [compareHash, setCompareHash] = useState('');
  const [matchResult, setMatchResult] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateHash = async () => {
    if (!password) return;
    setLoading(true);

    try {
      const bcrypt = (await import('bcryptjs')).default;
      // Use timeout to allow UI update before blocking sync operation
      setTimeout(() => {
        try {
          const salt = bcrypt.genSaltSync(rounds);
          const h = bcrypt.hashSync(password, salt);
          setHash(h);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      }, 50);
    } catch (error) {
      console.error('Failed to load bcrypt', error);
      setLoading(false);
    }
  };

  const checkMatch = async () => {
    if (!password || !compareHash) {
      setMatchResult(null);
      return;
    }
    try {
      const bcrypt = (await import('bcryptjs')).default;
      const isMatch = bcrypt.compareSync(password, compareHash);
      setMatchResult(isMatch);
    } catch (error) {
      console.error('Failed to load bcrypt', error);
    }
  };

  const handleCopy = () => {
    if (!hash) return;
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setPassword('');
    setHash('');
    setCompareHash('');
    setMatchResult(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Lock}
          title="Bcrypt Generator"
          description="Hash and verify passwords securely"
          iconBgColor="bg-red-100"
          iconColor="text-red-600"
        />

        {/* Toolbar */}
        <div className="p-3 bg-white border-b border-gray-100 flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={generateHash}
              disabled={loading || !password}
              className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium disabled:opacity-50 text-sm flex items-center"
            >
              {loading ? (
                <RefreshCw className="animate-spin mr-1.5" size={16} />
              ) : (
                <RefreshCw className="mr-1.5" size={16} />
              )}
              {loading ? 'Hashing...' : 'Hash Password'}
            </button>

            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-gray-200">
              <label className="text-xs font-bold text-slate-500 uppercase">Rounds:</label>
              <input
                type="number"
                min="4"
                max="15"
                value={rounds}
                onChange={e => setRounds(parseInt(e.target.value))}
                className="w-12 bg-transparent text-sm font-bold text-slate-700 outline-none text-center"
              />
            </div>
          </div>

          <button
            onClick={handleClear}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Clear All"
          >
            <Trash2 size={20} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Generator Section */}
            <div className="grid md:grid-cols-2 gap-6">
              <CodeEditor
                value={password}
                onChange={setPassword}
                label="Plaintext Password"
                placeholder="Enter password..."
                theme="light"
              />

              <CodeEditor
                value={hash}
                label="Generated Hash"
                placeholder="Hash will appear here..."
                readOnly
                theme="dark"
                actions={
                  hash && (
                    <ActionButton
                      icon={copied ? Check : Copy}
                      label={copied ? 'Copied' : 'Copy'}
                      onClick={handleCopy}
                      variant={copied ? 'success' : 'primary'}
                    />
                  )
                }
              />
            </div>

            {/* Verifier Section */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center border-b border-gray-100 pb-2">
                <Check size={18} className="mr-2 text-green-600" /> Verify Hash
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                    Hash to check
                  </label>
                  <input
                    type="text"
                    value={compareHash}
                    onChange={e => setCompareHash(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-sm"
                    placeholder="$2a$10$..."
                  />
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={checkMatch}
                    disabled={!password || !compareHash}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 text-sm"
                  >
                    Compare with Password
                  </button>

                  {matchResult !== null && (
                    <div
                      className={`px-4 py-2 rounded-lg flex items-center font-bold text-sm animate-in fade-in slide-in-from-right-2 ${
                        matchResult ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {matchResult ? (
                        <Check size={18} className="mr-2" />
                      ) : (
                        <AlertTriangle size={18} className="mr-2" />
                      )}
                      {matchResult ? 'Match! Valid Password.' : 'Do NOT Match.'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
