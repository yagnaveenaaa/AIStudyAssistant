import { Router } from 'express';
import studyRoutes from './study.routes.js';
import * as studyController from '../controllers/study.controller.js';

const router = Router();

router.get('/health', studyController.health);
router.use('/study', studyRoutes);

export default router;
