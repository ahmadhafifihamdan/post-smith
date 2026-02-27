import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import pool from '../config/db';

export const renderDashboard = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;

  try {
    const [profiles]: any = await pool.execute(
      'SELECT config_json FROM tone_profiles WHERE user_id = ?',
      [userId]
    );

    const profile = profiles[0]?.config_json || { 
      banned_words: [], 
      banned_phrases: [], 
      max_characters: 280 
    };

    res.render('dashboard', { 
      userId,
      profile 
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: "Could not load dashboard" });
  }
};