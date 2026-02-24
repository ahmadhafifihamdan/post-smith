import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';

// 1. Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// 2. Security & Middleware
app.use(helmet()); // Protects headers
app.use(cors());   // Allows frontend communication
app.use(express.json()); // Parses incoming JSON bodies

// 3. Health Check Route
app.get('/ping', (req: Request, res: Response) => {
  res.status(200).json({ message: 'pong', status: 'online' });
});

// 4. Start Server
app.listen(PORT, () => {
  console.log(`🚀 Post Smith Engine running on http://localhost:${PORT}`);
});