import { v4 as uuidv4 } from 'uuid';
import { documentRepository, DocumentFilterParams } from './document.repository.js';
import { templateRepository } from '../template/template.repository.js';
import { storageService } from '../../storage/storage.service.js';
import { AppError } from '../../shared/errors/app-error.js';
import { MIME_TYPES, STORAGE_SUBDIRS } from '../../config/constants.js';

export class DocumentService {
  async createFromTemplate(templateId: string, customTitle?: string, metadata?: Record<string, unknown>) {
    const template = await templateRepository.findById(templateId);

    if (!template || !template.isActive) {
      throw AppError.notFound(`Template with ID '${templateId}' not found`);
    }

    if (template.type !== 'DOCUMENT') {
      throw AppError.badRequest(`Template '${template.name}' is not a document template`);
    }

    const documentId = uuidv4();
    const destRelativePath = `${STORAGE_SUBDIRS.GENERATED_DOCUMENTS}/${documentId}.docx`;

    // Perform safe file clone
    let clonedSize = 0;
    try {
      const { size } = await storageService.cloneFile(template.storagePath, destRelativePath);
      clonedSize = size;
    } catch (err) {
      throw AppError.storageError('Failed to generate document file from template', err);
    }

    const documentTitle = customTitle?.trim() || `${template.name} (Copy)`;

    try {
      // Save metadata in database
      const document = await documentRepository.create({
        id: documentId,
        title: documentTitle,
        type: 'DOCUMENT',
        storagePath: destRelativePath,
        mimeType: MIME_TYPES.DOCX,
        fileSize: clonedSize,
        metadata: metadata ? (metadata as object) : (template.previewData as object) || {},
        template: {
          connect: { id: template.id },
        },
      });

      return document;
    } catch (dbError) {
      // Rollback physical file to prevent orphan files
      await storageService.deleteFile(destRelativePath);
      throw dbError;
    }
  }

  async listDocuments(params: DocumentFilterParams) {
    const { items, total } = await documentRepository.findMany({ ...params, type: 'DOCUMENT' });
    const totalPages = Math.ceil(total / params.limit) || 1;

    return {
      documents: items,
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

  async getDocumentById(id: string) {
    const document = await documentRepository.findById(id);
    if (!document || document.type !== 'DOCUMENT') {
      throw AppError.notFound(`Document with ID '${id}' not found`);
    }
    return document;
  }

  async updateDocument(id: string, updateData: { title?: string; metadata?: Record<string, unknown> }) {
    await this.getDocumentById(id);

    const updated = await documentRepository.update(id, {
      ...(updateData.title ? { title: updateData.title.trim() } : {}),
      ...(updateData.metadata ? { metadata: updateData.metadata as object } : {}),
    });

    return updated;
  }

  async getDownloadStream(id: string) {
    const document = await this.getDocumentById(id);

    const exists = await storageService.fileExists(document.storagePath);
    if (!exists) {
      throw AppError.fileNotFound('Physical document file does not exist in storage');
    }

    const stream = storageService.getReadStream(document.storagePath);
    const safeFilename = `${document.title.replace(/[^a-zA-Z0-9_\-\u00C0-\u024F\u1E00-\u1EFF]/g, '_')}.docx`;

    return {
      stream,
      filename: safeFilename,
      mimeType: document.mimeType || MIME_TYPES.DOCX,
      fileSize: document.fileSize,
    };
  }

  async deleteDocument(id: string) {
    const document = await this.getDocumentById(id);

    // Delete database record
    await documentRepository.delete(id);

    // Clean up physical file
    await storageService.deleteFile(document.storagePath);

    return { id, message: 'Document deleted successfully' };
  }
}

export const documentService = new DocumentService();
