import { Router } from 'express';
import { updateProfile } from '../controllers/profile.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Only logged-in users can update their profile.
router.put('/', authenticate, updateProfile);

export default router;