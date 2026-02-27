import { Router } from 'express';
import { getGenerationDetails } from '../controllers/generation.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/:id', authenticate, getGenerationDetails);

export default router;