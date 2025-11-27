import React, { useState } from 'react';
import { Share2, Link as LinkIcon, Copy, Check, Trash2 } from 'lucide-react';

export const SharelinkGenerator: React.FC = () => {
    const [url, setUrl] = useState('');
    const [text, setText] = useState('');
    const [platform, setPlatform] = useState('twitter');
    const [generatedLink, setGeneratedLink] = useState('');
    const [copied, setCopied] = useState(false);

    const generateLink = () => {
        const encodedUrl = encodeURIComponent(url);
        const encodedText = encodeURIComponent(text);

        let link = '';

        switch (platform) {
            case 'twitter':
                link = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
                break;
            case 'facebook':
                link = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                break;
            case 'linkedin':
                link = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
                break;
            case 'whatsapp':
                link = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
                break;
            case 'telegram':
                link = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
                break;
            case 'reddit':
                link = `https://reddit.com/submit?url=${encodedUrl}&title=${encodedText}`;
                break;
            case 'email':
                link = `mailto:?subject=${encodedText}&body=${encodedUrl}`;
                break;
        }

        setGeneratedLink(link);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 text-primary rounded-lg">
                            <Share2 size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Share Link Generator</h1>
                            <p className="text-sm text-slate-500">Create custom share links for social media</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Platform</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['twitter', 'facebook', 'linkedin', 'whatsapp', 'telegram', 'reddit', 'email'].map(p => (
                                    <button
                                        key={p}
                                        onClick={() => { setPlatform(p); setGeneratedLink(''); }}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all border ${platform === p
                                            ? 'bg-primary text-white border-primary shadow-md'
                                            : 'bg-white text-slate-600 border-gray-200 hover:border-primary'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-bold text-slate-700">URL to Share</label>
                                <button
                                    onClick={() => setUrl('')}
                                    className="text-xs text-red-500 hover:text-red-600 flex items-center"
                                >
                                    <Trash2 size={12} className="mr-1" /> Clear
                                </button>
                            </div>
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-slate-900"
                                placeholder="https://example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Message / Title (Optional)</label>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="w-full p-3 h-24 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none text-slate-900"
                                placeholder="Check this out!"
                            />
                        </div>

                        <button
                            onClick={generateLink}
                            className="w-full py-3 bg-primary text-white rounded-xl hover:bg-blue-600 transition-colors font-bold shadow-lg"
                        >
                            Generate Link
                        </button>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-6 border border-gray-200 flex flex-col">
                        <label className="block text-sm font-bold text-slate-700 mb-4">Generated Link</label>

                        {generatedLink ? (
                            <div className="space-y-4 flex-1">
                                <div className="relative">
                                    <textarea
                                        readOnly
                                        value={generatedLink}
                                        className="w-full h-32 p-4 pr-12 bg-white border border-gray-200 rounded-xl text-sm text-slate-600 outline-none resize-none"
                                    />
                                    <button
                                        onClick={handleCopy}
                                        className="absolute top-2 right-2 p-2 bg-slate-100 hover:bg-slate-200 rounded-md text-slate-600 transition-colors"
                                        title="Copy"
                                    >
                                        {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                    </button>
                                </div>

                                <a
                                    href={generatedLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full py-3 text-center bg-white border border-gray-200 text-primary rounded-xl hover:bg-blue-50 transition-colors font-bold shadow-sm"
                                >
                                    Test Link <LinkIcon size={16} className="inline ml-1" />
                                </a>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                                <Share2 size={48} className="mb-4 opacity-20" />
                                <p>Fill the form to generate a link</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
