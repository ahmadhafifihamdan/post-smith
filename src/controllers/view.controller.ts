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

export const renderGenerationDetails = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    // 1. Get the Run
    const [runs]: any = await pool.execute(
      'SELECT id, idea_prompt, status, error_message FROM generation_runs WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (runs.length === 0) return res.status(404).send("Generation not found");

    const run = runs[0];
    run.status = String(run.status).trim().toLowerCase();

    // 2. Get the Post
    const [posts]: any = await pool.execute(
      'SELECT content, status, rejection_reason FROM generated_posts WHERE generation_run_id = ?',
      [id]
    );

    res.render('generation-details', { run, posts });
  } catch (error) {
    res.status(500).send("Error loading generation details");
  }
};