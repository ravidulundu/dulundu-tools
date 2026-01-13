import { Binary } from 'lucide-react';
import React from 'react';

import { EncoderDecoderLayout } from '@/components/layouts/EncoderDecoderLayout';

export const Base64Converter: React.FC = () => {
  return (
    <EncoderDecoderLayout
      config={{
        icon: Binary,
        title: 'Base64 Converter',
        description: 'Encode and decode text to Base64 format',
        encodeLabels: {
          inputLabel: 'Text Source',
          outputLabel: 'Base64 Result',
          inputPlaceholder: 'Type text here to encode...',
        },
        decodeLabels: {
          inputLabel: 'Base64 String',
          outputLabel: 'Decoded Text',
          inputPlaceholder: 'Paste Base64 string here to decode...',
        },
        encode: (text: string) => btoa(text),
        decode: (text: string) => atob(text),
        decodeErrorMessage: 'Error: Invalid input for decoding',
        // Base64 from extension should be decoded
        shouldDecodeOnHashInput: () => true,
      }}
    />
  );
};
