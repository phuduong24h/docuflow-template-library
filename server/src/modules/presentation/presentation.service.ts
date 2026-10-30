import { v4 as uuidv4 } from 'uuid';
import { documentRepository, DocumentFilterParams } from '../document/document.repository.js';
import { templateRepository } from '../template/template.repository.js';
import { storageService } from '../../storage/storage.service.js';
import { AppError } from '../../shared/errors/app-error.js';
import { MIME_TYPES, STORAGE_SUBDIRS } from '../../config/constants.js';

export class PresentationService {
  async createFromTemplate(templateId: string, customTitle?: string, metadata?: Record<string, unknown>) {
    const template = await templateRepository.findById(templateId);

    if (!template || !template.isActive) {
      throw AppError.notFound(`Template with ID '${templateId}' not found`);
    }

    if (template.type !== 'PRESENTATION') {
      throw AppError.badRequest(`Template '${template.name}' is not a presentation template`);
    }

    const presentationId = uuidv4();
    const destRelativePath = `${STORAGE_SUBDIRS.GENERATED_PRESENTATIONS}/${presentationId}.pptx`;

    // Clone physical PPTX binary file
    let clonedSize = 0;
    try {
      const { size } = await storageService.cloneFile(template.storagePath, destRelativePath);
      clonedSize = size;
    } catch (err) {
      throw AppError.storageError('Failed to generate presentation file from template', err);
    }

    const presentationTitle = customTitle?.trim() || `${template.name} (Copy)`;

    try {
      const presentation = await documentRepository.create({
        id: presentationId,
        title: presentationTitle,
        type: 'PRESENTATION',
        storagePath: destRelativePath,
        mimeType: MIME_TYPES.PPTX,
        fileSize: clonedSize,
        metadata: metadata ? (metadata as object) : (template.previewData as object) || {},
        template: {
          connect: { id: template.id },
        },
      });

      return presentation;
    } catch (dbError) {
      // Rollback physical file to prevent orphan files
      await storageService.deleteFile(destRelativePath);
      throw dbError;
    }
  }

  async listPresentations(params: DocumentFilterParams) {
    const { items, total } = await documentRepository.findMany({ ...params, type: 'PRESENTATION' });
    const totalPages = Math.ceil(total / params.limit) || 1;

    return {
      presentations: items,
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

  async getPresentationById(id: string) {
    const presentation = await documentRepository.findById(id);
    if (!presentation || presentation.type !== 'PRESENTATION') {
      throw AppError.notFound(`Presentation with ID '${id}' not found`);
    }
    return presentation;
  }

  async getDownloadStream(id: string) {
    const presentation = await this.getPresentationById(id);

    const exists = await storageService.fileExists(presentation.storagePath);
    if (!exists) {
      throw AppError.fileNotFound('Physical presentation file does not exist in storage');
    }

    const stream = storageService.getReadStream(presentation.storagePath);
    const safeFilename = `${presentation.title.replace(/[^a-zA-Z0-9_\-\u00C0-\u024F\u1E00-\u1EFF]/g, '_')}.pptx`;

    return {
      stream,
      filename: safeFilename,
      mimeType: presentation.mimeType || MIME_TYPES.PPTX,
      fileSize: presentation.fileSize,
    };
  }

  async deletePresentation(id: string) {
    const presentation = await this.getPresentationById(id);

    // Delete database record
    await documentRepository.delete(id);

    // Clean up physical file
    await storageService.deleteFile(presentation.storagePath);

    return { id, message: 'Presentation deleted successfully' };
  }
}

export const presentationService = new PresentationService();
