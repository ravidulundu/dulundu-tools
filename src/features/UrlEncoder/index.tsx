import { Link as LinkIcon } from 'lucide-react';
import React from 'react';

import { EncoderDecoderLayout } from '@/components/layouts/EncoderDecoderLayout';

export const UrlEncoder: React.FC = () => {
  return (
    <EncoderDecoderLayout
      config={{
        icon: LinkIcon,
        title: 'URL Encoder / Decoder',
        description: 'Encode special characters or decode URL entities',
        iconBgColor: 'bg-indigo-100',
        iconColor: 'text-indigo-600',
        encodeLabels: {
          inputLabel: 'Decoded URL',
          outputLabel: 'Encoded Result',
          inputPlaceholder: 'Paste URL here to encode...',
        },
        decodeLabels: {
          inputLabel: 'Encoded URL',
          outputLabel: 'Decoded Result',
          inputPlaceholder: 'Paste encoded URL here to decode...',
        },
        encode: (text: string) => encodeURIComponent(text),
        decode: (text: string) => decodeURIComponent(text),
        decodeErrorMessage: 'Error: Invalid URL format for decoding',
        // If input looks encoded, decode it
        shouldDecodeOnHashInput: (input: string) => {
          try {
            return decodeURIComponent(input) !== input;
          } catch {
            return false;
          }
        },
      }}
    />
  );
};
