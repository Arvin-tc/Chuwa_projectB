import express from 'express';
import { getEmployeeProfiles } from '../controllers/hrEmployeeController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, getEmployeeProfiles);

export default router;
