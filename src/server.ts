import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import initDb from './config/initDb';
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';

// 1. Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// 2. Security & Middleware
app.use(helmet()); // Protects headers
app.use(cors());   // Allows frontend communication
app.use(express.json()); // Parses incoming JSON bodies
app.use('/auth', authRoutes); // Auth Routes
app.use('/profile', profileRoutes); // Profile routes

// 3. Health Check Route
app.get('/ping', (req: Request, res: Response) => {
  res.status(200).json({ message: 'pong', status: 'online' });
});

// 4. Start Server
const startServer = async () => {
  try {
    // Run the initialization script
    await initDb();

    app.listen(PORT, () => {
      console.log(`🚀 Post Smith Engine running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();