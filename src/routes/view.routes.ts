import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { renderDashboard, renderGenerationDetails } from '../controllers/view.controller';

const router = Router();

router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));
router.get('/dashboard', authenticate, renderDashboard);
router.get('/generations/:id', authenticate, renderGenerationDetails);

export default router;