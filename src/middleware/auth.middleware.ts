import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Express Request type to include userId
export interface AuthRequest extends Request {
  userId?: number;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  // 1. Get token from header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };
    
    // 3. Attach userId to the request object for use in other routes
    req.userId = decoded.userId;
    
    next(); // Move to the next function/controller
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
};