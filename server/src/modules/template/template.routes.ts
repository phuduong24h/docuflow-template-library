import { Router } from 'express';
import { templateController } from './template.controller.js';
import { validateRequest } from '../../shared/middlewares/validate.middleware.js';
import { listTemplatesSchema, templateIdParamSchema } from './template.validator.js';

const router = Router();

router.get('/categories', templateController.getCategories.bind(templateController));
router.get('/', validateRequest(listTemplatesSchema), templateController.list.bind(templateController));
router.get('/:id', validateRequest(templateIdParamSchema), templateController.getById.bind(templateController));
router.get('/:id/preview', validateRequest(templateIdParamSchema), templateController.getPreview.bind(templateController));

export const templateRouter = router;
