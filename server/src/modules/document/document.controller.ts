import { Request, Response, NextFunction } from 'express';
import { documentService } from './document.service.js';
import { sendSuccess } from '../../shared/utils/response.js';

export class DocumentController {
  async createFromTemplate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { templateId } = req.params;
      const { title, metadata } = req.body;

      const document = await documentService.createFromTemplate(templateId, title, metadata);
      sendSuccess(res, document, 'Document created successfully from template', 201);
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 12;
      const search = req.query.search as string | undefined;
      const sortBy = (req.query.sortBy as string) || 'createdAt';
      const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';

      const result = await documentService.listDocuments({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
      });

      sendSuccess(res, result.documents, 'Documents retrieved successfully', 200, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const document = await documentService.getDocumentById(id);
      sendSuccess(res, document, 'Document retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { title, metadata } = req.body;

      const updated = await documentService.updateDocument(id, { title, metadata });
      sendSuccess(res, updated, 'Document updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async download(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const downloadData = await documentService.getDownloadStream(id);

      // Safe header handling with encoded filename fallback
      const encodedFilename = encodeURIComponent(downloadData.filename);
      res.setHeader('Content-Type', downloadData.mimeType);
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${downloadData.filename}"; filename*=UTF-8''${encodedFilename}`
      );
      if (downloadData.fileSize) {
        res.setHeader('Content-Length', downloadData.fileSize);
      }

      downloadData.stream.pipe(res);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = await documentService.deleteDocument(id);
      sendSuccess(res, result, 'Document deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const documentController = new DocumentController();
