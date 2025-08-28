import express from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRouter from './routes/authRoutes.js';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(helmet());
app.use(express.json());

app.use('/api/auth', authRouter);

export default app;