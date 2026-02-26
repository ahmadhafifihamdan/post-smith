import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import pool from '../config/db';

export const createJob = async (req: AuthRequest, res: Response) => {
  const { idea_prompt } = req.body;
  const userId = req.userId;

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  if (!idea_prompt) return res.status(400).json({ error: 'Idea prompt is required' });

  try {
    // Insert the run as 'pending'
    const [result]: any = await pool.execute(
      'INSERT INTO generation_runs (user_id, idea_prompt, status) VALUES (?, ?, ?)',
      [userId, idea_prompt, 'pending']
    );

    // Return the ID immediately so the frontend can "poll" or wait
    res.status(202).json({ 
      message: 'Generation started', 
      generation_run_id: result.insertId 
    });
  } catch (error) {
    console.error('Create Job Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};