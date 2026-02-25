import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import pool from '../config/db';

export const updateProfile = async (req: AuthRequest, res: Response) => {
  const { banned_words, banned_phrases, max_characters, preferred_structure } = req.body;
  const userId = req.userId;

  // 1. Basic Validation for arrays
  if (!Array.isArray(banned_words) || !Array.isArray(banned_phrases)) {
    return res.status(400).json({ error: 'Banned words and phrases must be arrays.' });
  }

  if (!userId) {
    return res.status(401).json({ error: 'User ID not found in request.' });
  }

  try {
    // 2. Prepare the JSON configuration object
    const configJson = JSON.stringify({
      banned_words,
      banned_phrases,
      max_characters: max_characters || 280,
      preferred_structure: preferred_structure || ""
    });

    // 3. Update the profile belonging to the authenticated user
    const [result]: any = await pool.execute(
      'UPDATE tone_profiles SET config_json = ? WHERE user_id = ?',
      [configJson, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Profile not found.' });
    }

    res.status(200).json({ message: 'Tone profile updated successfully.' });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};