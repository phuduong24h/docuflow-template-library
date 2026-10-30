import { Router } from 'express';
import { documentController } from './document.controller.js';
import { validateRequest } from '../../shared/middlewares/validate.middleware.js';
import {
  createDocumentFromTemplateSchema,
  documentIdParamSchema,
  updateDocumentSchema,
  listDocumentsSchema,
} from './document.validator.js';

const router = Router();

router.post(
  '/from-template/:templateId',
  validateRequest(createDocumentFromTemplateSchema),
  documentController.createFromTemplate.bind(documentController)
);

router.get('/', validateRequest(listDocumentsSchema), documentController.list.bind(documentController));
router.get('/:id', validateRequest(documentIdParamSchema), documentController.getById.bind(documentController));
router.patch('/:id', validateRequest(updateDocumentSchema), documentController.update.bind(documentController));
router.get('/:id/download', validateRequest(documentIdParamSchema), documentController.download.bind(documentController));
router.delete('/:id', validateRequest(documentIdParamSchema), documentController.delete.bind(documentController));

export const documentRouter = router;
