
import React, { useState, useRef } from 'react';
import { Palette, Upload, Image as ImageIcon, Copy, Check } from 'lucide-react';

export const PaletteExtractor: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [colors, setColors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
       const url = URL.createObjectURL(file);
       setImage(url);
       extractColors(url);
    }
  };

  const extractColors = (url: string) => {
     setLoading(true);
     const img = new Image();
     img.crossOrigin = "Anonymous";
     img.src = url;
     img.onload = () => {
         const canvas = canvasRef.current;
         if (!canvas) return;
         
         const ctx = canvas.getContext('2d');
         if (!ctx) return;

         // Resize for performance
         const width = 100;
         const height = (img.height / img.width) * width;
         canvas.width = width;
         canvas.height = height;
         ctx.drawImage(img, 0, 0, width, height);

         const imageData = ctx.getImageData(0, 0, width, height).data;
         const colorCounts: Record<string, number> = {};

         // Quantize colors (round to nearest 10 for grouping)
         for (let i = 0; i < imageData.length; i += 4) {
             const r = Math.round(imageData[i] / 10) * 10;
             const g = Math.round(imageData[i+1] / 10) * 10;
             const b = Math.round(imageData[i+2] / 10) * 10;
             const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
             colorCounts[hex] = (colorCounts[hex] || 0) + 1;
         }

         const sorted = Object.entries(colorCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10) // Top 10 colors
            .map(([hex]) => hex);
         
         setColors(sorted);
         setLoading(false);
     };
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
           <div className="flex items-center space-x-3">
             <div className="p-2 bg-pink-100 text-pink-600 rounded-lg">
                <Palette size={24} />
             </div>
             <div>
                <h1 className="text-2xl font-bold text-slate-800">Image Palette Extractor</h1>
                <p className="text-sm text-slate-500">Extract dominant colors from any image</p>
             </div>
           </div>
        </div>

        <div className="p-8">
           <div 
             className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-all cursor-pointer mb-8 relative"
             onClick={() => fileInputRef.current?.click()}
           >
             <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*" />
             <canvas ref={canvasRef} className="hidden" />
             
             {image ? (
                <div className="flex flex-col items-center">
                   <img src={image} alt="Preview" className="max-h-64 rounded-lg shadow-md mb-4" />
                   <button className="text-sm text-primary hover:underline font-medium">Click to upload another image</button>
                </div>
             ) : (
                <div className="flex flex-col items-center text-slate-400 py-8">
                   <ImageIcon size={48} className="mb-4 text-slate-300" />
                   <p className="text-lg font-medium text-slate-600">Click to Upload Image</p>
                   <p className="text-sm">JPG, PNG, WEBP supported</p>
                </div>
             )}
           </div>

           {loading && <div className="text-center text-slate-500 font-medium">Analyzing colors...</div>}

           {colors.length > 0 && !loading && (
               <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {colors.map((hex) => (
                     <ColorCard key={hex} hex={hex} />
                  ))}
               </div>
           )}
        </div>
      </div>
    </div>
  );
};

const ColorCard: React.FC<{hex: string}> = ({hex}) => {
   const [copied, setCopied] = useState(false);
   const handleCopy = () => {
      navigator.clipboard.writeText(hex);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
   };

   return (
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={handleCopy}>
         <div className="h-24 w-full" style={{ backgroundColor: hex }}></div>
         <div className="p-3 flex justify-between items-center">
             <span className="font-mono font-bold text-slate-700">{hex}</span>
             {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-slate-400" />}
         </div>
      </div>
   );
};
