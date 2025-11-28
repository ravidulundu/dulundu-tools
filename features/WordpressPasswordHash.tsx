import React, { useState } from 'react';
import { Lock, RefreshCw, Copy, Check, Trash2 } from 'lucide-react';
import bcrypt from 'bcryptjs';
import { ToolHeader } from '../components/common/ToolHeader';
import { CodeEditor } from '../components/common/CodeEditor';
import { ActionButton } from '../components/common/ActionButton';

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

    const handleClear = () => {
        setPassword('');
        setHash('');
        setCopied(false);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">

                <ToolHeader
                    icon={Lock}
                    title="WordPress Password Hash"
                    description="Generate secure password hashes for WordPress database"
                />

                {/* Toolbar */}
                <div className="p-3 bg-white border-b border-gray-100 flex justify-between items-center flex-wrap gap-2">
                    <button
                        onClick={generateHash}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm flex items-center text-sm"
                    >
                        <RefreshCw size={16} className="mr-1.5" />
                        Generate Hash
                    </button>

                    <button
                        onClick={handleClear}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Clear All"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>

                {/* Editor Area */}
                <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30">
                    <div className="grid md:grid-cols-2 gap-4 h-full">

                        <CodeEditor
                            value={password}
                            onChange={setPassword}
                            label="Password"
                            placeholder="Enter password..."
                            theme="light"
                        />

                        <div className="flex flex-col h-full">
                            <CodeEditor
                                value={hash}
                                label="Generated Hash (Bcrypt / Modern WP)"
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
                            {hash && (
                                <p className="mt-2 text-xs text-slate-500 px-1">
                                    Note: This generates a standard Bcrypt hash ($2y$...), which is fully supported by modern WordPress versions.
                                    Legacy WordPress sites might use MD5-based Phpass ($P$...), but Bcrypt is recommended for security.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
