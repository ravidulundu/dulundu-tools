import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, Copy, Check } from 'lucide-react';

export const ImageToAscii: React.FC = () => {
    const [ascii, setAscii] = useState('');
    const [copied, setCopied] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const chars = "@%#*+=-:. "; // Dark to light

    const convertToAscii = (file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = canvasRef.current;
                if (!canvas) return;

                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                // Resize logic to keep ASCII manageable
                const width = 100;
                const scale = width / img.width;
                const height = Math.floor(img.height * scale * 0.5); // 0.5 to account for char aspect ratio

                canvas.width = width;
                canvas.height = height;

                ctx.drawImage(img, 0, 0, width, height);
                const imageData = ctx.getImageData(0, 0, width, height);
                const data = imageData.data;

                let result = "";
                for (let y = 0; y < height; y++) {
                    for (let x = 0; x < width; x++) {
                        const offset = (y * width + x) * 4;
                        const r = data[offset];
                        const g = data[offset + 1];
                        const b = data[offset + 2];

                        const avg = (r + g + b) / 3;
                        const charIndex = Math.floor((avg / 255) * (chars.length - 1));
                        result += chars[charIndex];
                    }
                    result += "\n";
                }
                setAscii(result);
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            convertToAscii(e.target.files[0]);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(ascii);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 text-primary rounded-lg">
                            <ImageIcon size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Image to ASCII</h1>
                            <p className="text-sm text-slate-500">Convert images to text art</p>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    <div className="flex flex-col items-center justify-center mb-8">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-8 py-4 border-2 border-dashed border-primary/30 bg-blue-50 text-primary rounded-xl hover:bg-blue-100 transition-colors flex flex-col items-center"
                        >
                            <Upload size={32} className="mb-2" />
                            <span className="font-bold">Upload Image</span>
                            <span className="text-xs opacity-70">JPG, PNG, GIF supported</span>
                        </button>
                    </div>

                    {ascii && (
                        <div className="relative">
                            <textarea
                                readOnly
                                value={ascii}
                                className="w-full h-[500px] p-4 font-mono text-[10px] leading-[10px] bg-black text-green-400 rounded-xl resize-none outline-none whitespace-pre overflow-auto"
                            />
                            <button
                                onClick={handleCopy}
                                className="absolute top-4 right-4 p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                                title="Copy"
                            >
                                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                            </button>
                        </div>
                    )}

                    <canvas ref={canvasRef} className="hidden" />
                </div>
            </div>
        </div>
    );
};
