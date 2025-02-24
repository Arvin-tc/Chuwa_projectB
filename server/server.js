import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/authRoutes.js';
import onboardingRoutes from './routes/onboardingRoutes.js';
import { fileURLToPath } from 'url';
import hrOperarionRoutes from './routes/hrOperationRoutes.js'

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(bodyParser.json());

// static file serving for uploaded files
// this allows access files via req params
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/auth', authRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/hrOperation', hrOperarionRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
