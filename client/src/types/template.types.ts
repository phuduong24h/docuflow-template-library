export type TemplateType = 'DOCUMENT' | 'PRESENTATION';

export interface Template {
  id: string;
  name: string;
  slug: string;
  type: TemplateType;
  category: string;
  description: string;
  thumbnailUrl: string;
  storagePath: string;
  previewData: Record<string, unknown>;
  mimeType: string;
  fileSize: number;
  version: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SlideItem {
  slideNumber: number;
  title: string;
  subtitle?: string;
  bullets?: string[];
}

export interface GeneratedDocument {
  id: string;
  title: string;
  templateId: string | null;
  template?: {
    name: string;
    category: string;
    description?: string;
    thumbnailUrl?: string;
  } | null;
  type: TemplateType;
  storagePath: string;
  mimeType: string;
  fileSize: number;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
  error?: {
    code: string;
    details?: unknown;
  };
}

export interface HealthCheckData {
  status: 'ok' | 'degraded';
  timestamp: string;
  uptime: number;
  services: {
    database: string;
    storage: string;
  };
}
