import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import initDb from './config/initDb';
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import generateRoutes from './routes/generate.routes';
import generationRoutes from './routes/generation.routes';
import { startWorker } from './services/worker.service';
import viewRoutes from './routes/view.routes';
import cookieParser from 'cookie-parser';


// 1. Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// 2. Security & Middleware
app.use(helmet()); // Protects headers
app.use(cors());   // Allows frontend communication
app.use(express.urlencoded({ extended: true })); // Handle HTML submission
app.use(express.json()); // Parses incoming JSON bodies

app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', './src/views');

app.use('/auth', authRoutes); // Auth Routes
app.use('/profile', profileRoutes); // Profile routes
app.use('/generate', generateRoutes); // Generate routes
app.use('/generation', generationRoutes); // Generate routes
app.use('/', viewRoutes); // View routes

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred on our end.' 
  });
});

// Start Server
const startServer = async () => {
  try {
    // Run the initialization script
    await initDb();

    app.listen(PORT, () => {
      console.log(`🚀 Post Smith Engine running on http://localhost:${PORT}`);
      startWorker();
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();