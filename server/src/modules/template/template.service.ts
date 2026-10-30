import { templateRepository, TemplateFilterParams } from './template.repository.js';
import { AppError } from '../../shared/errors/app-error.js';
import { TemplateType } from '@prisma/client';
import { storageService } from '../../storage/storage.service.js';
import mammoth from 'mammoth';

export class TemplateService {
  async listTemplates(params: TemplateFilterParams) {
    const { items, total } = await templateRepository.findMany(params);
    const totalPages = Math.ceil(total / params.limit) || 1;

    return {
      templates: items,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages,
        hasNextPage: params.page < totalPages,
        hasPrevPage: params.page > 1,
      },
    };
  }

  async getTemplateById(id: string) {
    const template = await templateRepository.findById(id);
    if (!template || !template.isActive) {
      throw AppError.notFound(`Template with ID '${id}' not found`);
    }
    return template;
  }

  async getTemplatePreview(id: string) {
    const template = await this.getTemplateById(id);

    // If template has previewData already stored in database
    if (template.previewData && Object.keys(template.previewData as object).length > 0) {
      return {
        id: template.id,
        name: template.name,
        type: template.type,
        previewData: template.previewData,
      };
    }

    // Dynamic fallback for DOCX: extract HTML preview using mammoth if available
    if (template.type === 'DOCUMENT' && template.storagePath.endsWith('.docx')) {
      try {
        const fileBuffer = await storageService.readFile(template.storagePath);
        const { value: html } = await mammoth.convertToHtml({ buffer: fileBuffer });
        return {
          id: template.id,
          name: template.name,
          type: template.type,
          previewData: { html },
        };
      } catch (err) {
        console.error('Failed to extract HTML preview with mammoth:', err);
      }
    }

    return {
      id: template.id,
      name: template.name,
      type: template.type,
      previewData: template.previewData || {},
    };
  }

  async getCategories(type?: TemplateType) {
    return templateRepository.getDistinctCategories(type);
  }
}

export const templateService = new TemplateService();
