import React, { useState } from 'react';
import { QrCode, Download, Link, Type } from 'lucide-react';
import { ToolHeader } from '../components/common/ToolHeader';

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
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">

        <ToolHeader
          icon={QrCode}
          title="QR Code Generator"
          description="Create QR codes for URLs, text, and more"
        />

        <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50/30 flex flex-col items-center">
          <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <label className="block text-sm font-bold text-slate-700 mb-2">Content</label>
                <div className="relative">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-inner min-h-[120px] resize-none transition-all"
                    placeholder="Enter URL or text..."
                  />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm grid gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Size (px)</label>
                  <input
                    type="number"
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    min="100" max="1000"
                    className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Foreground</label>
                    <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-xl border border-gray-200">
                      <input type="color" value={`#${color}`} onChange={(e) => setColor(e.target.value.substring(1))} className="h-8 w-8 rounded cursor-pointer border-0 bg-transparent" />
                      <input
                        type="text"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="flex-1 bg-transparent outline-none font-mono text-sm uppercase w-full"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Background</label>
                    <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-xl border border-gray-200">
                      <input type="color" value={`#${bgColor}`} onChange={(e) => setBgColor(e.target.value.substring(1))} className="h-8 w-8 rounded cursor-pointer border-0 bg-transparent" />
                      <input
                        type="text"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="flex-1 bg-transparent outline-none font-mono text-sm uppercase w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-gray-200 shadow-sm h-full min-h-[400px]">
              <div className="bg-white p-4 rounded-xl shadow-lg mb-8 border border-gray-100">
                <img src={qrUrl} alt="QR Code" className="max-w-full h-auto" style={{ width: size, height: size, maxWidth: '250px', maxHeight: '250px' }} />
              </div>

              <button
                onClick={downloadQr}
                className="flex items-center px-6 py-3 bg-primary text-white rounded-xl hover:bg-blue-600 transition-colors font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <Download size={20} className="mr-2" /> Download PNG
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
