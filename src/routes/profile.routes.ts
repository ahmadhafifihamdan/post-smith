import { Router } from 'express';
import { updateProfile, getProfile } from '../controllers/profile.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Only logged-in users can update and check their profile.
router.put('/', authenticate, updateProfile);
router.get('/', authenticate, getProfile);

export default router;