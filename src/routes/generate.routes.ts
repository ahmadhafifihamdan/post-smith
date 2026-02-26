import { Router } from 'express';
import { createJob } from '../controllers/generate.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, createJob);

export default router;