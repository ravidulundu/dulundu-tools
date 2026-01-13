import { Link as LinkIcon } from 'lucide-react';
import React from 'react';

import {
  EncoderDecoderConfig,
  EncoderDecoderLayout,
} from '@/components/layouts/EncoderDecoderLayout';

const URL_ENCODER_CONFIG: EncoderDecoderConfig = {
  icon: LinkIcon,
  title: 'URL Encoder / Decoder',
  description: 'Encode special characters or decode URL entities',
  iconBgColor: 'bg-accent-indigo/10',
  iconColor: 'text-accent-indigo',
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
  shouldDecodeOnHashInput: (input: string) => {
    try {
      return decodeURIComponent(input) !== input;
    } catch {
      return false;
    }
  },
};

export const UrlEncoder: React.FC = () => {
  return <EncoderDecoderLayout config={URL_ENCODER_CONFIG} />;
};
