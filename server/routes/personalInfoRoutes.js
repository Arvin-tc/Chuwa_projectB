import express from 'express';
import { getPersonalInfo, updatePersonalInfo } from '../controllers/personalInfoController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, getPersonalInfo);
router.patch('/', authenticate, updatePersonalInfo);

export default router;
