import React, { useState } from 'react';
import { Lock, RefreshCw, Copy, Check } from 'lucide-react';
import bcrypt from 'bcryptjs';

export const WordpressPasswordHash: React.FC = () => {
    const [password, setPassword] = useState('');
    const [hash, setHash] = useState('');
    const [copied, setCopied] = useState(false);

    const generateHash = () => {
        if (!password) return;

        // WordPress uses Phpass (Portable PHP password hashing framework)
        // Modern WP also supports bcrypt ($2y$)
        // Since we are in JS, implementing full Phpass is complex.
        // We will generate a bcrypt hash which is compatible with modern WP (since 2.5+)
        // and also explain the limitation.

        const salt = bcrypt.genSaltSync(10);
        const hashed = bcrypt.hashSync(password, salt);

        // To make it look like the old MD5 based one ($P$...), we would need a custom implementation.
        // But bcrypt is the secure standard now.
        // Let's stick to bcrypt but label it clearly.
        setHash(hashed);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(hash);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 text-primary rounded-lg">
                            <Lock size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">WordPress Password Hash</h1>
                            <p className="text-sm text-slate-500">Generate secure password hashes for WordPress database</p>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    <div className="max-w-xl mx-auto space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                            <input
                                type="text"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900"
                                placeholder="Enter password..."
                            />
                        </div>

                        <button
                            onClick={generateHash}
                            className="w-full py-3 bg-primary text-white rounded-xl hover:bg-blue-600 transition-colors font-bold shadow-lg flex items-center justify-center"
                        >
                            <RefreshCw size={20} className="mr-2" /> Generate Hash
                        </button>

                        {hash && (
                            <div className="bg-slate-50 p-6 rounded-xl border border-gray-200 animate-fade-in">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Generated Hash (Bcrypt / Modern WP)</label>
                                <div className="relative">
                                    <div className="p-4 bg-white border border-gray-200 rounded-lg font-mono text-sm break-all text-slate-800">
                                        {hash}
                                    </div>
                                    <button
                                        onClick={handleCopy}
                                        className="absolute top-2 right-2 p-2 bg-slate-100 hover:bg-slate-200 rounded-md text-slate-600 transition-colors"
                                        title="Copy"
                                    >
                                        {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                    </button>
                                </div>
                                <p className="mt-3 text-xs text-slate-400">
                                    Note: This generates a standard Bcrypt hash ($2y$...), which is fully supported by modern WordPress versions.
                                    Legacy WordPress sites might use MD5-based Phpass ($P$...), but Bcrypt is recommended for security.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
