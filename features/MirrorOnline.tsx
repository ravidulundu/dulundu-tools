import React, { useState } from 'react';
import { Globe, RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export const MirrorOnline: React.FC = () => {
    const [url, setUrl] = useState('');
    const [status, setStatus] = useState<'idle' | 'checking' | 'up' | 'down' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const checkStatus = async () => {
        if (!url) return;

        let target = url;
        if (!target.startsWith('http')) {
            target = 'https://' + target;
        }

        setStatus('checking');
        setMessage('');

        try {
            // We use no-cors mode because most sites block CORS.
            // An opaque response (type: 'opaque') usually means the server is reachable.
            // A network error usually means it's down or DNS failed.
            await fetch(target, { mode: 'no-cors', cache: 'no-cache' });
            setStatus('up');
            setMessage('Website is reachable!');
        } catch (e) {
            setStatus('down');
            setMessage('Website seems down or unreachable.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden text-center p-8">
                <div className="inline-block p-4 bg-blue-50 text-primary rounded-full mb-6">
                    <Globe size={40} />
                </div>

                <h1 className="text-3xl font-bold text-slate-800 mb-2">Is It Down?</h1>
                <p className="text-slate-500 mb-8">Check if a website is online or offline.</p>

                <div className="flex gap-2 mb-8">
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="example.com"
                        className="flex-1 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900"
                        onKeyDown={(e) => e.key === 'Enter' && checkStatus()}
                    />
                    <button
                        onClick={checkStatus}
                        disabled={status === 'checking' || !url}
                        className="px-6 py-4 bg-primary text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 transition-colors font-bold shadow-md flex items-center"
                    >
                        {status === 'checking' ? <RefreshCw size={20} className="animate-spin" /> : 'Check'}
                    </button>
                </div>

                {status !== 'idle' && status !== 'checking' && (
                    <div className={`p-6 rounded-xl border flex items-center justify-center space-x-3 animate-fade-in ${status === 'up' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
                        }`}>
                        {status === 'up' ? <CheckCircle size={24} /> : <XCircle size={24} />}
                        <span className="font-bold text-lg">{message}</span>
                    </div>
                )}

                <div className="mt-6 text-xs text-slate-400 flex items-start justify-center">
                    <AlertCircle size={14} className="mr-1 mt-0.5 shrink-0" />
                    <span className="max-w-xs text-left">
                        Note: This tool performs a client-side check. Some websites might block these requests or appear down due to browser security policies (CORS).
                    </span>
                </div>
            </div>
        </div>
    );
};
