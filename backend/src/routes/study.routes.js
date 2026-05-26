import { Router } from 'express';
import * as studyController from '../controllers/study.controller.js';
import { validateBody, validateQuery } from '../middleware/validateBody.js';
import { explainRequestSchema, historyQuerySchema } from '../schemas/request.schema.js';

const router = Router();

router.post('/explain', validateBody(explainRequestSchema), studyController.explain);
router.get('/history', validateQuery(historyQuerySchema), studyController.getHistory);
router.get('/history/:id', studyController.getSession);

export default router;
