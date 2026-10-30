import { Request, Response, NextFunction } from 'express';
import { templateService } from './template.service.js';
import { sendSuccess } from '../../shared/utils/response.js';
import { TemplateType } from '@prisma/client';

export class TemplateController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const type = req.query.type as TemplateType | undefined;
      const category = req.query.category as string | undefined;
      const search = req.query.search as string | undefined;
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 12;
      const sortBy = (req.query.sortBy as string) || 'createdAt';
      const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';

      const result = await templateService.listTemplates({
        type,
        category,
        search,
        page,
        limit,
        sortBy,
        sortOrder,
      });

      sendSuccess(res, result.templates, 'Templates retrieved successfully', 200, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const template = await templateService.getTemplateById(id);
      sendSuccess(res, template, 'Template retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getPreview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const preview = await templateService.getTemplatePreview(id);
      sendSuccess(res, preview, 'Template preview retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const type = req.query.type as TemplateType | undefined;
      const categories = await templateService.getCategories(type);
      sendSuccess(res, categories, 'Categories retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const templateController = new TemplateController();
