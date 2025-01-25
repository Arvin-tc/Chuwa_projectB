import express from 'express';
import { getVisaStatus } from '../controllers/visaStatusController.js';
import {authenticate} from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, getVisaStatus);

export default router;
