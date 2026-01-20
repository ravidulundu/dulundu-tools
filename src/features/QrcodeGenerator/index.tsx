import { AlertCircle, Download, Loader2, QrCode, ScanLine, Upload } from 'lucide-react';
import React, { useMemo, useRef, useState } from 'react';

import { ToolHeader } from '@/components/common/ToolHeader';
import { ToolPageLayout } from '@/components/layouts/ToolPageLayout';
import { downloadFile } from '@/utils/downloadUtils';

export const QrcodeGenerator: React.FC = () => {
  const [mode, setMode] = useState<'generate' | 'scan'>('generate');

  // Generate State
  const [text, setText] = useState('https://example.com');
  const [size, setSize] = useState(250);
  const [color, setColor] = useState('000000');
  const [bgColor, setBgColor] = useState('ffffff');

  // Scan State
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Using api.qrserver.com which is a reliable public API for QR codes
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
    text
  )}&color=${color}&bgcolor=${bgColor}&margin=10`;

  // Validate and memoize safe URL for QR image
  // deepcode ignore DOMXSS: URL origin is validated against hardcoded trusted domain (api.qrserver.com)
  const safeQrUrl = useMemo(() => {
    try {
      const parsed = new URL(qrUrl);
      // Only allow our trusted QR API domain and strict https protocol
      if (parsed.protocol === 'https:' && parsed.origin === 'https://api.qrserver.com') {
        return parsed.href;
      }
    } catch {
      // Invalid URL
    }
    return undefined;
  }, [qrUrl]);

  const downloadQr = async () => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      downloadFile(url, 'qrcode.png');
      // Delay revoke to ensure download completes
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (_e) {
      alert("Could not download image. Please try right-clicking the image and 'Save Image As'.");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setScanResult(null);
    setScanError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://api.qrserver.com/v1/read-qr-code/', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (data && data[0] && data[0].symbol && data[0].symbol[0].data) {
        setScanResult(data[0].symbol[0].data);
      } else if (data && data[0] && data[0].symbol && data[0].symbol[0].error) {
        setScanError('Could not decode QR code. Please ensure the image is clear.');
      } else {
        setScanError('No QR code found in the image.');
      }
    } catch (_err) {
      setScanError('Error connecting to decoding service.');
    } finally {
      setIsScanning(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <ToolPageLayout>
      <div className="bg-card rounded-2xl shadow-sm border border-border flex flex-col h-full overflow-hidden">
        <ToolHeader
          icon={QrCode}
          title="QR Code Generator"
          description="Generate and Scan QR codes"
        />

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setMode('generate')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              mode === 'generate'
                ? 'text-primary border-b-2 border-primary bg-primary-light/50'
                : 'text-foreground-muted hover:text-foreground-secondary hover:bg-background-secondary'
            }`}
          >
            Generate QR
          </button>
          <button
            onClick={() => setMode('scan')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              mode === 'scan'
                ? 'text-primary border-b-2 border-primary bg-primary-light/50'
                : 'text-foreground-muted hover:text-foreground-secondary hover:bg-background-secondary'
            }`}
          >
            Scan QR (Decode)
          </button>
        </div>

        <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-background-secondary/30 flex flex-col items-center">
          {mode === 'generate' ? (
            <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-6">
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                  <label
                    htmlFor="qr-content"
                    className="block text-sm font-bold text-foreground-secondary mb-2"
                  >
                    Content
                  </label>
                  <div className="relative">
                    <textarea
                      id="qr-content"
                      value={text}
                      onChange={e => setText(e.target.value)}
                      className="w-full p-4 bg-background-secondary border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-inner min-h-[120px] resize-none transition-all"
                      placeholder="Enter URL or text..."
                    />
                  </div>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border shadow-sm grid gap-6">
                  <div>
                    <label
                      htmlFor="qr-size"
                      className="block text-sm font-bold text-foreground-secondary mb-2"
                    >
                      Size (px)
                    </label>
                    <input
                      id="qr-size"
                      type="number"
                      value={size}
                      onChange={e => setSize(Number(e.target.value))}
                      min="100"
                      max="1000"
                      className="w-full p-3 bg-background-secondary border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="qr-fg-color"
                        className="block text-sm font-bold text-foreground-secondary mb-2"
                      >
                        Foreground
                      </label>
                      <div className="flex items-center space-x-2 bg-background-secondary p-2 rounded-xl border border-border">
                        <input
                          id="qr-fg-color"
                          type="color"
                          value={`#${color}`}
                          onChange={e => setColor(e.target.value.substring(1))}
                          className="h-8 w-8 rounded cursor-pointer border-0 bg-transparent"
                        />
                        <input
                          type="text"
                          value={color}
                          onChange={e => setColor(e.target.value)}
                          className="flex-1 bg-transparent outline-none font-mono text-sm uppercase w-full"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="qr-bg-color"
                        className="block text-sm font-bold text-foreground-secondary mb-2"
                      >
                        Background
                      </label>
                      <div className="flex items-center space-x-2 bg-background-secondary p-2 rounded-xl border border-border">
                        <input
                          id="qr-bg-color"
                          type="color"
                          value={`#${bgColor}`}
                          onChange={e => setBgColor(e.target.value.substring(1))}
                          className="h-8 w-8 rounded cursor-pointer border-0 bg-transparent"
                        />
                        <input
                          type="text"
                          value={bgColor}
                          onChange={e => setBgColor(e.target.value)}
                          className="flex-1 bg-transparent outline-none font-mono text-sm uppercase w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-8 bg-card rounded-2xl border border-border shadow-sm h-full min-h-96">
                <div className="bg-card p-4 rounded-xl shadow-lg mb-8 border border-border">
                  <img
                    src={safeQrUrl}
                    alt="QR Code"
                    className="max-w-full h-auto"
                    style={{
                      width: size,
                      height: size,
                      maxWidth: '250px',
                      maxHeight: '250px',
                    }}
                  />
                </div>

                <button
                  onClick={downloadQr}
                  className="flex items-center px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <Download size={20} className="mr-2" /> Download PNG
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-full bg-card p-8 rounded-2xl border border-border shadow-sm text-center">
                <div className="mb-8">
                  <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                    <ScanLine size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Upload QR Code Image</h3>
                  <p className="text-foreground-muted">
                    Select an image file containing a QR code to decode it.
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isScanning}
                  className="w-full py-4 border-2 border-dashed border-border rounded-xl hover:border-primary hover:bg-primary-light transition-all flex flex-col items-center justify-center text-foreground-muted hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isScanning ? (
                    <>
                      <Loader2 size={32} className="animate-spin mb-2" />
                      <span className="font-medium">Decoding...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={32} className="mb-2" />
                      <span className="font-medium">Click to Upload Image</span>
                    </>
                  )}
                </button>

                {scanError && (
                  <div className="mt-6 p-4 bg-danger-light text-danger rounded-xl border border-danger/20 flex items-center text-left">
                    <AlertCircle size={20} className="mr-3 flex-shrink-0" />
                    <p className="text-sm font-medium">{scanError}</p>
                  </div>
                )}

                {scanResult && (
                  <div className="mt-8 text-left animate-in fade-in zoom-in duration-300">
                    <span className="block text-xs font-bold text-foreground-muted uppercase mb-2 tracking-wide">
                      Decoded Content
                    </span>
                    <div className="p-4 bg-success-light border border-success/30 rounded-xl break-all font-mono text-foreground shadow-sm">
                      {scanResult}
                    </div>
                    <div className="mt-4 flex justify-center">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(scanResult);
                          alert('Copied to clipboard!');
                        }}
                        className="text-sm font-medium text-primary hover:text-primary/80 hover:underline"
                      >
                        Copy Content
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolPageLayout>
  );
};
