import { z } from 'zod';
import { ValidationSchemas } from '../../shared/middlewares/validate.middleware.js';

export const listTemplatesSchema: ValidationSchemas = {
  query: z.object({
    type: z.enum(['DOCUMENT', 'PRESENTATION']).optional(),
    category: z.string().optional(),
    search: z.string().optional(),
    page: z.string().optional().transform((v) => (v ? parseInt(v, 10) : 1)),
    limit: z.string().optional().transform((v) => (v ? parseInt(v, 10) : 12)),
    sortBy: z.enum(['name', 'createdAt', 'category']).optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  }),
};

export const templateIdParamSchema: ValidationSchemas = {
  params: z.object({
    id: z.string().uuid({ message: 'Template ID must be a valid UUID' }),
  }),
};
