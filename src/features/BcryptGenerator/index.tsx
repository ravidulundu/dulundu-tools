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
      <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Lock}
          title="Bcrypt Generator"
          description="Hash and verify passwords securely"
          iconBgColor="bg-red-100"
          iconColor="text-red-600"
        />

        {/* Toolbar */}
        <div className="p-3 bg-card border-b border-border flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={generateHash}
              disabled={loading || !password}
              className="px-4 py-2 bg-foreground text-background rounded-lg hover:bg-foreground-secondary transition-colors font-medium disabled:opacity-50 text-sm flex items-center"
            >
              {loading ? (
                <RefreshCw className="animate-spin mr-1.5" size={16} />
              ) : (
                <RefreshCw className="mr-1.5" size={16} />
              )}
              {loading ? 'Hashing...' : 'Hash Password'}
            </button>

            <div className="flex items-center gap-2 bg-background-secondary px-3 py-1.5 rounded-lg border border-border">
              <label className="flex items-center gap-2 text-xs font-bold text-foreground-muted uppercase">
                Rounds:
                <input
                  type="number"
                  min="4"
                  max="15"
                  value={rounds}
                  onChange={e => setRounds(parseInt(e.target.value))}
                  className="w-12 bg-transparent text-sm font-bold text-foreground-secondary outline-none text-center"
                />
              </label>
            </div>
          </div>

          <button
            onClick={handleClear}
            className="p-2 text-foreground-muted hover:text-danger hover:bg-danger-light rounded-lg transition-colors"
            title="Clear All"
          >
            <Trash2 size={20} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-background-secondary/30 overflow-y-auto">
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
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm mt-6">
              <h3 className="font-bold text-foreground mb-4 flex items-center border-b border-border pb-2">
                <Check size={18} className="mr-2 text-success" /> Verify Hash
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block">
                    <span className="block text-xs font-bold text-foreground-muted uppercase mb-2">
                      Hash to check
                    </span>
                    <input
                      type="text"
                      value={compareHash}
                      onChange={e => setCompareHash(e.target.value)}
                      className="w-full p-3 bg-background-secondary border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-sm"
                      placeholder="$2a$10$..."
                    />
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={checkMatch}
                    disabled={!password || !compareHash}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium disabled:opacity-50 text-sm"
                  >
                    Compare with Password
                  </button>

                  {matchResult !== null && (
                    <div
                      className={`px-4 py-2 rounded-lg flex items-center font-bold text-sm animate-in fade-in slide-in-from-right-2 ${
                        matchResult
                          ? 'bg-success-light text-success'
                          : 'bg-danger-light text-danger'
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
