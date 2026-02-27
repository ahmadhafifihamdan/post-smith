import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { renderDashboard } from '../controllers/view.controller';

const router = Router();

router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));
router.get('/dashboard', authenticate, renderDashboard);

export default router;