import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import pool from '../config/db';

export const updateProfile = async (req: AuthRequest, res: Response) => {
  const banned_words_raw = req.body.banned_words as string || "";
  const banned_phrases_raw = req.body.banned_phrases as string || "";
  const { max_characters, preferred_structure } = req.body;
  const userId = req.userId;

    // 1. Basic Validation for arrays
  if (!userId) {
    return res.status(401).json({ error: 'User ID not found in request.' });
  }

  try {
    // 2. Prepare the JSON configuration object
    const configJson = {
      max_characters: parseInt(max_characters) || 280,
      banned_words: banned_words_raw.split(',').map((w: string) => w.trim()).filter((w: string) => w !== ""),
      banned_phrases: banned_phrases_raw.split('\n').map((p: string) => p.trim()).filter((p: string) => p !== ""),
      preferred_structure: preferred_structure?.trim() || ""
    };

    // 3. Update the profile belonging to the authenticated user
    await pool.execute(
      `INSERT INTO tone_profiles (user_id, config_json, updated_at) 
       VALUES (?, ?, NOW()) 
       ON DUPLICATE KEY UPDATE config_json = VALUES(config_json), updated_at = NOW()`,
      [userId, JSON.stringify(configJson)]
    );

    res.redirect('/dashboard');

  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: 'User ID not found.' });
  }

  try {
    const [rows]: any = await pool.execute(
      'SELECT config_json FROM tone_profiles WHERE user_id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found.' });
    }
    res.status(200).json(rows[0].config_json);

  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};