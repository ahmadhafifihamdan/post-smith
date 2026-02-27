import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import pool from '../config/db';

export const getGenerationDetails = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.userId;

  if (!id || !userId) {
    return res.status(400).json({ error: "Missing required identification." });
  }

  try {
    // Fetch the run details
    const [runs]: any = await pool.execute(
      'SELECT id, idea_prompt, status, error_message, created_at FROM generation_runs WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (runs.length === 0) {
      return res.status(404).json({ error: 'Generation run not found' });
    }

    const run = runs[0];

    // If completed, fetch the associated posts
    let posts = [];
    if (run.status === 'completed') {
      const [postRows]: any = await pool.execute(
        'SELECT id, content, status, rejection_reason, created_at FROM generated_posts WHERE generation_run_id = ?',
        [id]
      );
      posts = postRows;
    }

    // Return structured response
    res.status(200).json({
      ...run,
      posts: run.status === 'completed' ? posts : undefined
    });
  } catch (error) {
    console.error('Get Generation Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};