import React, { useState, useRef } from 'react';
import { Image, Upload, Download, RefreshCw, FileImage, Binary } from 'lucide-react';

export const ImageConverter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'convert' | 'base64'>('convert');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<{name: string, size: number} | null>(null);
  const [outputFormat, setOutputFormat] = useState<string>('image/png');
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [base64Output, setBase64Output] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileInfo({ name: file.name, size: file.size });
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setSelectedImage(result);
        setConvertedImage(null);
        setBase64Output('');
        
        // Auto convert for base64 tab
        if (activeTab === 'base64') {
            setBase64Output(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const convertImage = () => {
    if (!selectedImage) return;

    const img = document.createElement('img');
    img.src = selectedImage;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL(outputFormat, 0.92);
        setConvertedImage(dataUrl);
      }
    };
  };

  const getFormatExt = (mime: string) => mime.split('/')[1];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
           <div className="flex items-center space-x-3">
             <div className="p-2 bg-blue-100 text-primary rounded-lg">
                <Image size={24} />
             </div>
             <div>
                <h1 className="text-2xl font-bold text-slate-800">Image Tools</h1>
                <p className="text-sm text-slate-500">Convert formats and Base64</p>
             </div>
           </div>
           
           <div className="flex bg-white p-1 rounded-lg border border-gray-200">
              <button 
                onClick={() => setActiveTab('convert')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'convert' ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Format Converter
              </button>
              <button 
                onClick={() => setActiveTab('base64')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'base64' ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Image to Base64
              </button>
           </div>
        </div>

        <div className="p-6">
           {/* Upload Area */}
           <div 
             className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-all cursor-pointer mb-8"
             onClick={() => fileInputRef.current?.click()}
           >
             <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
             {selectedImage ? (
                <div className="flex flex-col items-center">
                   <img src={selectedImage} alt="Preview" className="h-48 object-contain mb-4 rounded-lg shadow-sm" />
                   <p className="font-medium text-slate-800">{fileInfo?.name}</p>
                   <p className="text-sm text-slate-500">{(fileInfo?.size! / 1024).toFixed(2)} KB</p>
                   <button className="mt-4 text-sm text-primary hover:underline">Click to change image</button>
                </div>
             ) : (
                <div className="flex flex-col items-center text-slate-400">
                   <Upload size={48} className="mb-4" />
                   <p className="text-lg font-medium text-slate-600">Click to Upload Image</p>
                   <p className="text-sm">Supports JPG, PNG, WEBP, BMP</p>
                </div>
             )}
           </div>

           {selectedImage && activeTab === 'convert' && (
             <div className="bg-slate-50 rounded-xl p-6 border border-gray-200">
                <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                   <div className="flex-1 w-full">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Convert To</label>
                      <select 
                        value={outputFormat} 
                        onChange={(e) => setOutputFormat(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary/50"
                      >
                         <option value="image/png">PNG</option>
                         <option value="image/jpeg">JPG</option>
                         <option value="image/webp">WEBP</option>
                      </select>
                   </div>
                   <button 
                     onClick={convertImage}
                     className="w-full md:w-auto px-8 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center mt-6 md:mt-0"
                   >
                     <RefreshCw size={20} className="mr-2" /> Convert
                   </button>
                </div>

                {convertedImage && (
                   <div className="flex items-center justify-between p-4 bg-green-50 border border-green-100 rounded-lg animate-fade-in">
                      <div className="flex items-center space-x-3">
                         <FileImage className="text-green-600" size={24} />
                         <div>
                            <p className="font-semibold text-green-800">Conversion Complete</p>
                            <p className="text-xs text-green-600">Ready to download</p>
                         </div>
                      </div>
                      <a 
                        href={convertedImage} 
                        download={`converted-image.${getFormatExt(outputFormat)}`}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center text-sm font-medium"
                      >
                        <Download size={16} className="mr-2" /> Download
                      </a>
                   </div>
                )}
             </div>
           )}

           {selectedImage && activeTab === 'base64' && (
             <div className="bg-slate-50 rounded-xl p-6 border border-gray-200">
                <label className="block text-sm font-medium text-slate-700 mb-2">Base64 Output</label>
                <div className="flex-1 relative rounded-xl border border-gray-800 bg-[#1e293b] overflow-hidden shadow-md">
                   <textarea 
                     value={base64Output}
                     readOnly
                     className="w-full h-64 p-4 bg-[#1e293b] text-gray-50 font-mono text-xs resize-none outline-none leading-relaxed"
                   />
                </div>
                <button 
                  onClick={() => navigator.clipboard.writeText(base64Output)}
                  className="mt-4 w-full py-3 bg-white border border-gray-300 text-slate-700 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm"
                >
                  Copy Base64 to Clipboard
                </button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};