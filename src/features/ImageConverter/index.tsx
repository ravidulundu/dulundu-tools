import { Image, Upload, Download, RefreshCw, FileImage, Copy, Check } from 'lucide-react';
import React, { useState, useRef } from 'react';

import { ActionButton } from '@/components/common/ActionButton';
import { CodeEditor } from '@/components/common/CodeEditor';
import { ToolHeader } from '@/components/common/ToolHeader';

export const ImageConverter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'convert' | 'base64' | 'decode'>('convert');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<{
    name: string;
    size: number;
  } | null>(null);
  const [outputFormat, setOutputFormat] = useState<string>('image/png');
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [base64Output, setBase64Output] = useState('');
  const [base64Input, setBase64Input] = useState('');
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileInfo({ name: file.name, size: file.size });
      const reader = new FileReader();
      reader.onload = event => {
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

  const handleCopy = () => {
    navigator.clipboard.writeText(base64Output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={Image}
          title="Image Tools"
          description="Convert formats, Encode to Base64, and Decode Base64"
        />

        {/* Toolbar */}
        <div className="p-3 bg-card border-b border-border flex justify-center gap-4 overflow-x-auto">
          <div className="flex bg-background-secondary p-1 rounded-lg whitespace-nowrap">
            <button
              onClick={() => setActiveTab('convert')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'convert'
                  ? 'bg-card text-primary shadow-sm'
                  : 'text-foreground-muted hover:text-foreground'
              }`}
            >
              Format Converter
            </button>
            <button
              onClick={() => setActiveTab('base64')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'base64'
                  ? 'bg-card text-primary shadow-sm'
                  : 'text-foreground-muted hover:text-foreground'
              }`}
            >
              Image to Base64
            </button>
            <button
              onClick={() => setActiveTab('decode')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'decode'
                  ? 'bg-card text-primary shadow-sm'
                  : 'text-foreground-muted hover:text-foreground'
              }`}
            >
              Base64 to Image
            </button>
          </div>
        </div>

        <div className="flex-1 p-4 md:p-6 overflow-hidden bg-background-secondary/30 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Upload Area - Only for Convert and Encode tabs */}
            {activeTab !== 'decode' && (
              <div
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    fileInputRef.current?.click();
                  }
                }}
                className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-background-secondary transition-all cursor-pointer bg-card"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
                {selectedImage ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={selectedImage}
                      alt="Preview"
                      className="h-48 object-contain mb-4 rounded-lg shadow-sm"
                    />
                    <p className="font-medium text-foreground">{fileInfo?.name}</p>
                    <p className="text-sm text-foreground-muted">
                      {((fileInfo?.size || 0) / 1024).toFixed(2)} KB
                    </p>
                    <button className="mt-4 text-sm text-primary hover:underline">
                      Click to change image
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-foreground-muted">
                    <Upload size={48} className="mb-4" />
                    <p className="text-lg font-medium text-foreground-secondary">Click to Upload Image</p>
                    <p className="text-sm">Supports JPG, PNG, WEBP, BMP</p>
                  </div>
                )}
              </div>
            )}

            {/* Format Converter UI */}
            {selectedImage && activeTab === 'convert' && (
              <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                <div className="flex flex-col md:flex-row items-end gap-4 mb-6">
                  <div className="flex-1 w-full">
                    <label
                      htmlFor="output-format"
                      className="block text-sm font-medium text-foreground-secondary mb-2"
                    >
                      Convert To
                    </label>
                    <select
                      id="output-format"
                      value={outputFormat}
                      onChange={e => setOutputFormat(e.target.value)}
                      className="w-full p-3 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/50 bg-card"
                    >
                      <option value="image/png">PNG</option>
                      <option value="image/jpeg">JPG</option>
                      <option value="image/webp">WEBP</option>
                    </select>
                  </div>
                  <button
                    onClick={convertImage}
                    className="w-full md:w-auto px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center justify-center"
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

            {/* Image to Base64 UI */}
            {selectedImage && activeTab === 'base64' && (
              <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                <CodeEditor
                  value={base64Output}
                  label="Base64 Output"
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

            {/* Base64 to Image UI */}
            {activeTab === 'decode' && (
              <div className="grid md:grid-cols-2 gap-6 h-[600px]">
                <div className="flex flex-col h-full">
                  <CodeEditor
                    value={base64Input}
                    onChange={setBase64Input}
                    label="Base64 Input"
                    placeholder="Paste Base64 string here (data:image/png;base64,...)"
                    theme="light"
                  />
                </div>
                <div className="flex flex-col h-full bg-card rounded-xl border border-border overflow-hidden">
                  <div className="px-4 py-2 bg-background-secondary border-b border-border text-xs font-bold text-foreground-muted uppercase">
                    Preview
                  </div>
                  <div className="flex-1 flex items-center justify-center p-4 bg-background-secondary/50 overflow-hidden relative">
                    {base64Input ? (
                      <img
                        src={
                          base64Input.startsWith('data:')
                            ? base64Input
                            : `data:image/png;base64,${base64Input}`
                        }
                        alt="Preview"
                        className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
                        onError={e => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          // Could add error state here
                        }}
                        onLoad={e => {
                          (e.target as HTMLImageElement).style.display = 'block';
                        }}
                      />
                    ) : (
                      <div className="text-foreground-muted flex flex-col items-center">
                        <Image size={48} className="mb-2 opacity-50" />
                        <p>Image preview will appear here</p>
                      </div>
                    )}
                  </div>
                  {base64Input && (
                    <div className="p-4 border-t border-border bg-card flex justify-end">
                      <a
                        href={
                          base64Input.startsWith('data:')
                            ? base64Input
                            : `data:image/png;base64,${base64Input}`
                        }
                        download="decoded-image.png"
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center text-sm font-medium"
                      >
                        <Download size={16} className="mr-2" /> Download Image
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
