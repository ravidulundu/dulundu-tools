// Shared constants between frontend and backend
// This file is the single source of truth for AI tool options

export const EMAIL_TONE_OPTIONS = [
  'Professional',
  'Friendly',
  'Urgent',
  'Apologetic',
  'Persuasive',
] as const;

export type EmailTone = (typeof EMAIL_TONE_OPTIONS)[number];

export const SUMMARY_LENGTH_OPTIONS = [
  { value: 'medium', label: 'Medium Paragraph' },
  { value: 'short', label: 'Short (1-2 Sentences)' },
  { value: 'bullets', label: 'Bullet Points' },
  { value: 'long', label: 'Detailed Summary' },
] as const;

export type SummaryLength = (typeof SUMMARY_LENGTH_OPTIONS)[number]['value'];
