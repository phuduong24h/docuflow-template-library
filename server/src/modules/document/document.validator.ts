import { z } from 'zod';
import { ValidationSchemas } from '../../shared/middlewares/validate.middleware.js';

export const createDocumentFromTemplateSchema: ValidationSchemas = {
  params: z.object({
    templateId: z.string().uuid({ message: 'Template ID must be a valid UUID' }),
  }),
  body: z.object({
    title: z.string().min(1).max(150).optional(),
    metadata: z.record(z.any()).optional(),
  }),
};

export const documentIdParamSchema: ValidationSchemas = {
  params: z.object({
    id: z.string().uuid({ message: 'Document ID must be a valid UUID' }),
  }),
};

export const updateDocumentSchema: ValidationSchemas = {
  params: z.object({
    id: z.string().uuid({ message: 'Document ID must be a valid UUID' }),
  }),
  body: z.object({
    title: z.string().min(1).max(150).optional(),
    metadata: z.record(z.any()).optional(),
  }),
};

export const listDocumentsSchema: ValidationSchemas = {
  query: z.object({
    page: z.string().optional().transform((v) => (v ? parseInt(v, 10) : 1)),
    limit: z.string().optional().transform((v) => (v ? parseInt(v, 10) : 12)),
    search: z.string().optional(),
    sortBy: z.enum(['title', 'createdAt', 'updatedAt']).optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  }),
};
