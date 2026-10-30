export const MIME_TYPES = {
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  PPTX: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  PDF: 'application/pdf',
  SVG: 'image/svg+xml',
  PNG: 'image/png',
  JSON: 'application/json',
} as const;

export const STORAGE_SUBDIRS = {
  TEMPLATES_DOCUMENTS: 'templates/documents',
  TEMPLATES_PRESENTATIONS: 'templates/presentations',
  GENERATED_DOCUMENTS: 'generated/documents',
  GENERATED_PRESENTATIONS: 'generated/presentations',
  THUMBNAILS: 'thumbnails',
} as const;

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 12,
  MAX_LIMIT: 50,
} as const;
