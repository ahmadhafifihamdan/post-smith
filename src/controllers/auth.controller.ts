import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/db';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // 1. Basic Validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Insert User
    const [userResult]: any = await connection.execute(
      'INSERT INTO users (email, password_hash) VALUES (?, ?)',
      [email, hashedPassword]
    );
    const userId = userResult.insertId;

    // 4. Create Default Tone Profile
    const defaultTone = JSON.stringify({
      banned_words: [],
      banned_phrases: [],
      max_characters: 280,
      preferred_structure: null
    });

    await connection.execute(
      'INSERT INTO tone_profiles (user_id, config_json) VALUES (?, ?)',
      [userId, defaultTone]
    );

    // Commit insertions
    await connection.commit();

    res.status(201).json({ 
      message: 'User registered successfully', 
      userId 
    });

  } catch (error: any) {
    await connection.rollback();

    // Handle duplicate email error (MySQL Error Code 1062)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email already exists' });
    }

    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    connection.release();
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // 1. Validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // 2. Find user by email
    const [rows]: any = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    const user = rows[0];

    // 3. If user doesn't exist OR password doesn't match
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 4. Create JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
      return res.redirect('/dashboard');
    }

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};