import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Express Request type to include userId
export interface AuthRequest extends Request {
  userId?: number;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  // 1. Get token from header or cookies
  const token = req.headers.authorization?.split(' ')[1] || req.cookies.token; 

  if (!token) {
    return res.status(401).redirect('/login'); // Redirect to login if no token
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.clearCookie('token');
    return res.status(401).redirect('/login');
  }
};