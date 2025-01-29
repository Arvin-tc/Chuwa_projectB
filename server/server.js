import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/authRoutes.js';
import onboardingRoutes from './routes/onboardingRoutes.js';
import personalInfoRoutes from './routes/personalInfoRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import visaStatusRoutes from './routes/visaStatusRoutes.js';
import hiringManagementRouter from './routes/hiringManagementRoutes.js';
import hrVisaStatusRoutes from './routes/hrVisaStatusRoutes.js';
import hrEmployeeRoutes from './routes/hrEmployeeRoutes.js';
import { fileURLToPath } from 'url';

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

// employee
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/personal-info', personalInfoRoutes);
app.get('/favicon.ico', (req, res) => res.status(204));
app.use('/api/uploads', uploadRoutes);
app.use('/api/visa', visaStatusRoutes);
app.use('/sample', express.static(path.join(__dirname, 'sample')));

// hr
app.use('/api/hr', hiringManagementRouter);
app.use('/api/hr/visa', hrVisaStatusRoutes);
app.use('/api/hr/profiles', hrEmployeeRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Oops something went wrong');
})

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
