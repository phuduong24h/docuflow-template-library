import { Router } from 'express';
import { presentationController } from './presentation.controller.js';
import { validateRequest } from '../../shared/middlewares/validate.middleware.js';
import {
  createPresentationFromTemplateSchema,
  presentationIdParamSchema,
  listPresentationsSchema,
} from './presentation.validator.js';

const router = Router();

router.post(
  '/from-template/:templateId',
  validateRequest(createPresentationFromTemplateSchema),
  presentationController.createFromTemplate.bind(presentationController)
);

router.get('/', validateRequest(listPresentationsSchema), presentationController.list.bind(presentationController));
router.get('/:id', validateRequest(presentationIdParamSchema), presentationController.getById.bind(presentationController));
router.get('/:id/download', validateRequest(presentationIdParamSchema), presentationController.download.bind(presentationController));
router.delete('/:id', validateRequest(presentationIdParamSchema), presentationController.delete.bind(presentationController));

export const presentationRouter = router;
