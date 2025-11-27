
import React, { useState } from 'react';
import { QrCode, Download, Link, Type } from 'lucide-react';

export const QrcodeGenerator: React.FC = () => {
  const [text, setText] = useState('https://example.com');
  const [size, setSize] = useState(250);
  const [color, setColor] = useState('000000');
  const [bgColor, setBgColor] = useState('ffffff');

  // Using api.qrserver.com which is a reliable public API for QR codes
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&color=${color}&bgcolor=${bgColor}&margin=10`;

  const downloadQr = async () => {
      try {
          const response = await fetch(qrUrl);
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'qrcode.png';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
      } catch (e) {
          alert("Could not download image. Please try right-clicking the image and 'Save Image As'.");
      }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center space-x-3 bg-slate-50/50">
           <div className="p-2 bg-blue-100 text-primary rounded-lg">
              <QrCode size={24} />
           </div>
           <div>
              <h1 className="text-2xl font-bold text-slate-800">QR Code Generator</h1>
              <p className="text-sm text-slate-500">Create QR codes for URLs, text, and more</p>
           </div>
        </div>

        <div className="p-8 grid md:grid-cols-2 gap-8">
           <div className="space-y-6">
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Content</label>
                  <div className="relative">
                      <textarea 
                        value={text} 
                        onChange={(e) => setText(e.target.value)}
                        className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm min-h-[100px]"
                        placeholder="Enter URL or text..."
                      />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Size (px)</label>
                      <input 
                        type="number" 
                        value={size} 
                        onChange={(e) => setSize(Number(e.target.value))}
                        min="100" max="1000"
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Foreground</label>
                      <div className="flex items-center space-x-2">
                          <input type="color" value={`#${color}`} onChange={(e) => setColor(e.target.value.substring(1))} className="h-10 w-10 rounded cursor-pointer border-0" />
                          <input 
                            type="text" 
                            value={color} 
                            onChange={(e) => setColor(e.target.value)}
                            className="flex-1 p-2 bg-white border border-gray-200 rounded-lg outline-none font-mono text-sm uppercase"
                          />
                      </div>
                  </div>
               </div>
           </div>

           <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-gray-100">
               <div className="bg-white p-2 rounded-xl shadow-md mb-6">
                   <img src={qrUrl} alt="QR Code" className="max-w-full h-auto" style={{ width: size, height: size, maxWidth: '250px', maxHeight: '250px' }} />
               </div>
               
               <button 
                 onClick={downloadQr}
                 className="flex items-center px-6 py-3 bg-primary text-white rounded-xl hover:bg-blue-600 transition-colors font-bold shadow-md"
               >
                  <Download size={20} className="mr-2" /> Download PNG
               </button>
           </div>
        </div>
      </div>
    </div>
  );
};
