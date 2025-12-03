import { useState, useRef, useCallback } from 'react';

interface UseToolLogicProps {
  initialInput?: string;
  initialOutput?: string;
}

export const useToolLogic = ({ initialInput = '', initialOutput = '' }: UseToolLogicProps = {}) => {
  const [input, setInput] = useState(initialInput);
  const [output, setOutput] = useState(initialOutput);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = useCallback(() => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const handleClear = useCallback(() => {
    setInput('');
    setOutput('');
    setError(null);
  }, []);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, callback?: (content: string) => void) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = event => {
        const content = event.target?.result as string;
        setInput(content);
        if (callback) callback(content);
      };
      reader.readAsText(file);
    },
    []
  );

  const handleDownload = useCallback(
    (filename: string, type: string = 'text/plain') => {
      if (!output) return;
      const blob = new Blob([output], { type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    },
    [output]
  );

  return {
    input,
    setInput,
    output,
    setOutput,
    error,
    setError,
    copied,
    fileInputRef,
    handleCopy,
    handleClear,
    handleFileUpload,
    handleDownload,
  };
};
