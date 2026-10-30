import { Request, Response, NextFunction } from 'express';
import { presentationService } from './presentation.service.js';
import { sendSuccess } from '../../shared/utils/response.js';

export class PresentationController {
  async createFromTemplate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { templateId } = req.params;
      const { title, metadata } = req.body;

      const presentation = await presentationService.createFromTemplate(templateId, title, metadata);
      sendSuccess(res, presentation, 'Presentation created successfully from template', 201);
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

      const result = await presentationService.listPresentations({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
      });

      sendSuccess(res, result.presentations, 'Presentations retrieved successfully', 200, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const presentation = await presentationService.getPresentationById(id);
      sendSuccess(res, presentation, 'Presentation retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async download(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const downloadData = await presentationService.getDownloadStream(id);

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
      const result = await presentationService.deletePresentation(id);
      sendSuccess(res, result, 'Presentation deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const presentationController = new PresentationController();
