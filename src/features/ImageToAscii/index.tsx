import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, Copy, Check } from 'lucide-react';
import { ToolHeader } from '@/components/common/ToolHeader';
import { CodeEditor } from '@/components/common/CodeEditor';
import { ActionButton } from '@/components/common/ActionButton';

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
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">

                <ToolHeader
                    icon={ImageIcon}
                    title="Image to ASCII"
                    description="Convert images to text art"
                />

                <div className="flex-1 p-4 md:p-6 overflow-hidden bg-gray-50/30 overflow-y-auto">
                    <div className="max-w-4xl mx-auto space-y-6 h-full flex flex-col">
                        <div className="flex flex-col items-center justify-center">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="px-8 py-4 border-2 border-dashed border-primary/30 bg-white text-primary rounded-xl hover:bg-blue-50 transition-colors flex flex-col items-center w-full max-w-md"
                            >
                                <Upload size={32} className="mb-2" />
                                <span className="font-bold">Upload Image</span>
                                <span className="text-xs opacity-70">JPG, PNG, GIF supported</span>
                            </button>
                        </div>

                        {ascii && (
                            <div className="flex-1 min-h-0">
                                <CodeEditor
                                    value={ascii}
                                    label="ASCII Output"
                                    readOnly
                                    theme="dark"
                                    actions={
                                        <ActionButton
                                            icon={copied ? Check : Copy}
                                            label={copied ? 'Copied' : 'Copy'}
                                            onClick={handleCopy}
                                            variant={copied ? 'success' : 'primary'}
                                        />
                                    }
                                />
                            </div>
                        )}

                        <canvas ref={canvasRef} className="hidden" />
                    </div>
                </div>
            </div>
        </div>
    );
};
